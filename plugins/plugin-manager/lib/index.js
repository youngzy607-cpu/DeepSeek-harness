/**
 * dsh-plugin-manager — Host 半边
 *
 * 在 Harness 的 Plugins 设置区新增“我的插件”管理入口：
 *  - GET  /plugin-manager/plugins             列出受管自定义插件及启停状态
 *  - POST /plugin-manager/plugins/:id         设置 { enabled: true|false }
 *
 * 启停先通过 Loader 直接更新运行状态，再写入对应 profile patch，避免
 * 手工编辑 patch 文件先触发旧配置覆盖运行时状态。
 */
import { readFile, rename, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const ROUTE_PREFIX = '/plugin-manager/plugins'
const DEFAULT_PATCH_FILE = 'cordis.patch.yml'
const DEFAULT_MANAGED = ['usage-monitor']

const FIBER_PHASE = {
  0: 'pending',
  1: 'loading',
  2: 'active',
  3: 'failed',
  4: null,
  5: 'unloading',
}

function sendJson(res, status, body) {
  const data = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  res.end(data)
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
      if (raw.length > 1_000_000) {
        reject(new Error('request body too large'))
        req.destroy()
      }
    })
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function setPluginDisabledInPatch(text, id, disabled) {
  const lines = text.split('\n')
  const itemPattern = new RegExp(
    `^(\\s*)-\\s+id:\\s*['"]?${escapeRegExp(id)}['"]?\\s*(?:#.*)?$`,
  )
  let start = -1
  for (let i = 0; i < lines.length; i += 1) {
    if (itemPattern.test(lines[i])) {
      start = i
      break
    }
  }
  if (start === -1) {
    throw new Error(`未在 cordis.patch.yml 中找到插件条目：${id}`)
  }

  const dashIndent = lines[start].match(/^\s*/)[0].length
  const fieldIndent = dashIndent + 2
  const fieldSpaces = ' '.repeat(fieldIndent)

  let end = lines.length
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i]
    if (line.trim() === '') continue
    const indent = line.match(/^\s*/)[0].length
    if (indent <= dashIndent) {
      end = i
      break
    }
  }

  const block = lines.slice(start + 1, end)
  const disabledPattern = new RegExp(
    `^ {${fieldIndent}}disabled:\\s*(?:true|false)(?:\\s*#.*)?$`,
  )
  const disabledIndex = block.findIndex((line) => disabledPattern.test(line))

  if (disabled) {
    if (disabledIndex >= 0 && /disabled:\s*true/.test(block[disabledIndex])) {
      return text
    }
    if (disabledIndex >= 0) {
      block[disabledIndex] = `${fieldSpaces}disabled: true`
      lines.splice(start + 1, block.length, ...block)
      return lines.join('\n')
    }
    lines.splice(start + 1, 0, `${fieldSpaces}disabled: true`)
    return lines.join('\n')
  }

  if (disabledIndex >= 0) {
    lines.splice(start + 1 + disabledIndex, 1)
  }
  return lines.join('\n')
}

/**
 * 受管条目在 profile patch 中是同一 insert 列表的普通行。旧版的通用
 * 正则在移除 disabled 字段时会漏掉嵌套条目；这里用确定的行边界处理。
 */
function setManagedPluginDisabledInPatch(text, id, disabled) {
  const lines = text.split('\n')
  const target = `- id: ${id}`
  const start = lines.findIndex((line) => line.trim() === target)
  if (start < 0) throw new Error(`未在 cordis.patch.yml 中找到插件条目：${id}`)

  const dashIndent = lines[start].match(/^\s*/)[0].length
  let end = lines.length
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i]
    const indent = line.match(/^\s*/)[0].length
    if (indent <= dashIndent && line.trimStart().startsWith('- id: ')) {
      end = i
      break
    }
  }

  const disabledIndex = lines.findIndex((line, index) => (
    index > start && index < end && line.trim() === 'disabled: true'
  ))
  if (disabled) {
    if (disabledIndex < 0) lines.splice(start + 1, 0, `${' '.repeat(dashIndent + 2)}disabled: true`)
  } else if (disabledIndex >= 0) {
    lines.splice(disabledIndex, 1)
  }
  return lines.join('\n')
}

async function writeFileAtomic(filename, content) {
  const tmp = `${filename}.tmp`
  await writeFile(tmp, content, 'utf8')
  await rename(tmp, filename)
}

function resolvePatchPath(ctx, config) {
  const baseUrl = ctx.loader?.ctx?.baseUrl
  if (!baseUrl) throw new Error('无法定位 Loader baseUrl')
  const filename = config?.patchFile || DEFAULT_PATCH_FILE
  return fileURLToPath(new URL(filename, baseUrl))
}

function findEntryById(ctx, id) {
  for (const entry of ctx.loader.entries()) {
    if (entry.options.group) continue
    if (entry.options.id === id) return entry
  }
  return undefined
}

function listManagedPlugins(ctx, managed) {
  const byId = new Map()
  for (const entry of ctx.loader.entries()) {
    if (entry.options.group) continue
    byId.set(entry.options.id, entry)
  }
  return managed.map((id) => {
    const entry = byId.get(id)
    if (!entry) {
      return {
        id,
        name: null,
        exists: false,
        enabled: false,
        phase: null,
      }
    }
    return {
      id,
      name: entry.options.name,
      exists: true,
      enabled: !entry.disabled,
      phase: entry.fiber ? FIBER_PHASE[entry.fiber.state] : null,
    }
  })
}

export default {
  name: 'dsh-plugin-manager',

  inject: ['webServer', 'loader'],

  apply(ctx, config) {
    const managed = Array.isArray(config?.managed) && config.managed.length > 0
      ? config.managed.map(String)
      : [...DEFAULT_MANAGED]

    ctx.effect(() => ctx.webServer.register({
      kind: 'prefix',
      path: ROUTE_PREFIX,
      handler: async (req, res) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const pathname = url.pathname.replace(/\/+$/, '') || ROUTE_PREFIX

        try {
          if (req.method === 'GET' && pathname === ROUTE_PREFIX) {
            sendJson(res, 200, {
              ok: true,
              plugins: listManagedPlugins(ctx, managed),
            })
            return
          }

          if (req.method === 'POST' && pathname.startsWith(`${ROUTE_PREFIX}/`)) {
            const id = decodeURIComponent(pathname.slice(ROUTE_PREFIX.length + 1))
            if (!managed.includes(id)) {
              sendJson(res, 403, {
                ok: false,
                error: { message: `插件 ${id} 不在受管列表中` },
              })
              return
            }
            const body = await readJsonBody(req)
            if (typeof body?.enabled !== 'boolean') {
              sendJson(res, 400, {
                ok: false,
                error: { message: '请求体需要 { "enabled": true|false }' },
              })
              return
            }
            const entry = findEntryById(ctx, id)
            if (!entry) {
              sendJson(res, 404, {
                ok: false,
                error: { message: `插件条目不存在：${id}` },
              })
              return
            }

            const patchPath = resolvePatchPath(ctx, config)
            const original = await readFile(patchPath, 'utf8')
            const next = setManagedPluginDisabledInPatch(original, id, !body.enabled)

            try {
              // 先直接更新运行时条目；不能经 tree.update()，否则 profile
              // 组合层会把尚未重载的旧 patch 状态重新覆盖回来。运行时已
              // 成功切换后再写入同一状态，避免 patch 覆盖内存中的新状态。
              await entry.update({
                disabled: body.enabled ? null : true,
              }, false, true)
              if (next !== original) await writeFileAtomic(patchPath, next)

              const updated = findEntryById(ctx, id)
              const actualEnabled = Boolean(updated && !updated.disabled)
              if (!updated || actualEnabled !== body.enabled) {
                throw new Error(`插件 ${id} 未达到目标状态`)
              }
              sendJson(res, 200, {
                ok: true,
                plugin: {
                  id,
                  enabled: actualEnabled,
                },
              })
            } catch (err) {
              throw err
            }
            return
          }

          sendJson(res, 404, {
            ok: false,
            error: { message: `未找到接口：${req.method} ${pathname}` },
          })
        } catch (err) {
          if (ctx.logger) ctx.logger.warn(`[plugin-manager] request failed: ${err?.message ?? err}`)
          sendJson(res, 500, {
            ok: false,
            error: { message: String(err?.message ?? err) },
          })
        }
      },
    }), 'dsh-plugin-manager: routes')
  },
}
