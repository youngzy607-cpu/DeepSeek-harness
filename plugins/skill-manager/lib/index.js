/**
 * dsh-skill-manager — Host 半边
 *
 * 管理 ~/.dsh/skills/ 下的 Skill 文件（CRUD + 打开文件夹）。
 *
 * 路由：
 *  GET    /skill-manager/skills           — 列出所有 skill（解析 frontmatter）
 *  GET    /skill-manager/skills/:name     — 读取单个 skill 完整内容
 *  POST   /skill-manager/skills/:name     — 创建或更新 skill
 *  DELETE /skill-manager/skills/:name     — 删除 skill
 *  POST   /skill-manager/open-folder      — 在系统文件管理器中打开 skills 目录
 */
import { cp, mkdir, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { spawn } from 'node:child_process'

const ROUTE_PREFIX = '/skill-manager'
const skillsRoot = join(homedir(), '.dsh', 'skills')

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
        reject(new Error('请求体过大（上限 1 MB）'))
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

async function writeFileAtomic(filename, content) {
  const tmp = `${filename}.tmp`
  await writeFile(tmp, content, 'utf8')
  await rename(tmp, filename)
}

/** 解析 frontmatter + 正文 */
function parseSkill(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) {
    return { frontmatter: {}, body: content }
  }
  const fmText = match[1]
  const body = match[2]
  const frontmatter = {}
  for (const line of fmText.split('\n')) {
    const m = line.match(/^(\w+):\s*(.*)$/)
    if (m) {
      let val = m[2].trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      frontmatter[m[1]] = val
    }
  }
  return { frontmatter, body }
}

/** 生成 frontmatter + 正文 */
function serializeSkill(frontmatter, body) {
  const fmLines = []
  for (const key of ['name', 'description', 'whenToUse']) {
    if (frontmatter[key] != null && frontmatter[key] !== '') {
      const val = String(frontmatter[key])
      if (/[:#\[\]{}'"&*!|>%@`]/.test(val)) {
        fmLines.push(`${key}: "${val.replace(/"/g, '\\"')}"`)
      } else {
        fmLines.push(`${key}: ${val}`)
      }
    }
  }
  if (fmLines.length === 0) return body
  return `---\n${fmLines.join('\n')}\n---\n${body}`
}

/** 列出 skills 目录下的条目 */
async function listSkills() {
  let entries
  try {
    entries = await readdir(skillsRoot, { withFileTypes: true })
  } catch (err) {
    if (err.code === 'ENOENT') return []
    throw err
  }
  const skills = []
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const skillFile = join(skillsRoot, entry.name, 'SKILL.md')
      try {
        const content = await readFile(skillFile, 'utf8')
        const { frontmatter } = parseSkill(content)
        skills.push({
          name: frontmatter.name || entry.name,
          dirName: entry.name,
          description: frontmatter.description || '',
          whenToUse: frontmatter.whenToUse || '',
          format: 'bundle',
        })
      } catch {
        // 目录存在但没有 SKILL.md，跳过
      }
    } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') {
      const filePath = join(skillsRoot, entry.name)
      try {
        const content = await readFile(filePath, 'utf8')
        const { frontmatter } = parseSkill(content)
        const baseName = entry.name.replace(/\.md$/, '')
        skills.push({
          name: frontmatter.name || baseName,
          dirName: baseName,
          description: frontmatter.description || '',
          whenToUse: frontmatter.whenToUse || '',
          format: 'flat',
        })
      } catch {
        // 读取失败，跳过
      }
    }
  }
  return skills.sort((a, b) => a.name.localeCompare(b.name))
}

/** 读取单个 skill 完整内容 */
async function readSkill(name) {
  // 先尝试目录形式
  const bundlePath = join(skillsRoot, name, 'SKILL.md')
  try {
    const content = await readFile(bundlePath, 'utf8')
    const parsed = parseSkill(content)
    return { ...parsed, format: 'bundle', dirName: name }
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
  }
  // 再尝试扁平形式
  const flatPath = join(skillsRoot, `${name}.md`)
  try {
    const content = await readFile(flatPath, 'utf8')
    const parsed = parseSkill(content)
    return { ...parsed, format: 'flat', dirName: name }
  } catch (err) {
    if (err.code === 'ENOENT') return null
    throw err
  }
}

/** 创建或更新 skill */
async function writeSkill(name, body) {
  const format = body.format === 'bundle' ? 'bundle' : 'flat'
  const content = serializeSkill(body.frontmatter || {}, body.body || '')
  if (format === 'bundle') {
    const dir = join(skillsRoot, name)
    await mkdir(dir, { recursive: true })
    await writeFileAtomic(join(dir, 'SKILL.md'), content)
  } else {
    await mkdir(skillsRoot, { recursive: true })
    await writeFileAtomic(join(skillsRoot, `${name}.md`), content)
  }
}

/** 删除 skill */
async function deleteSkill(name) {
  // 先尝试目录形式
  const dirPath = join(skillsRoot, name)
  try {
    const s = await stat(dirPath)
    if (s.isDirectory()) {
      await rm(dirPath, { recursive: true, force: true })
      return true
    }
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
  }
  // 再尝试扁平形式
  const flatPath = join(skillsRoot, `${name}.md`)
  try {
    await rm(flatPath, { force: true })
    return true
  } catch (err) {
    if (err.code === 'ENOENT') return false
    throw err
  }
}

/** 在系统文件管理器中打开 skills 目录 */
function openFolder() {
  const platform = process.platform
  if (platform === 'win32') {
    spawn('explorer', [skillsRoot], { shell: true, detached: true, stdio: 'ignore' })
  } else if (platform === 'darwin') {
    spawn('open', [skillsRoot], { detached: true, stdio: 'ignore' })
  } else {
    spawn('xdg-open', [skillsRoot], { detached: true, stdio: 'ignore' })
  }
}

export default {
  name: 'dsh-skill-manager',

  inject: ['webServer'],

  apply(ctx) {
    ctx.effect(() => ctx.webServer.register({
      kind: 'prefix',
      path: ROUTE_PREFIX,
      handler: async (req, res) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const pathname = url.pathname.replace(/\/+$/, '') || ROUTE_PREFIX

        try {
          // GET /skill-manager/skills — 列出所有 skill
          if (req.method === 'GET' && pathname === ROUTE_PREFIX) {
            const skills = await listSkills()
            sendJson(res, 200, { ok: true, skills })
            return
          }

          // POST /skill-manager/open-folder — 打开 skills 目录
          if (req.method === 'POST' && pathname === `${ROUTE_PREFIX}/open-folder`) {
            openFolder()
            sendJson(res, 200, { ok: true })
            return
          }

          // GET /skill-manager/skills/:name — 读取单个 skill
          if (req.method === 'GET' && pathname.startsWith(`${ROUTE_PREFIX}/skills/`)) {
            const name = decodeURIComponent(pathname.slice(`${ROUTE_PREFIX}/skills/`.length))
            if (!name) {
              sendJson(res, 400, { ok: false, error: { message: '缺少 skill 名称' } })
              return
            }
            const skill = await readSkill(name)
            if (!skill) {
              sendJson(res, 404, { ok: false, error: { message: `Skill "${name}" 不存在` } })
              return
            }
            sendJson(res, 200, { ok: true, skill })
            return
          }

          // POST /skill-manager/skills/:name — 创建或更新 skill
          if (req.method === 'POST' && pathname.startsWith(`${ROUTE_PREFIX}/skills/`)) {
            const name = decodeURIComponent(pathname.slice(`${ROUTE_PREFIX}/skills/`.length))
            if (!name || !/^[a-z0-9][a-z0-9-]*$/.test(name)) {
              sendJson(res, 400, { ok: false, error: { message: 'Skill 名称必须为 kebab-case（小写字母、数字、连字符）' } })
              return
            }
            const body = await readJsonBody(req)
            if (typeof body?.body !== 'string' && typeof body?.frontmatter !== 'object') {
              sendJson(res, 400, { ok: false, error: { message: '请求体需要 { "frontmatter": {...}, "body": "...", "format": "flat|bundle" }' } })
              return
            }
            await writeSkill(name, body)
            sendJson(res, 200, { ok: true })
            return
          }

          // DELETE /skill-manager/skills/:name — 删除 skill
          if (req.method === 'DELETE' && pathname.startsWith(`${ROUTE_PREFIX}/skills/`)) {
            const name = decodeURIComponent(pathname.slice(`${ROUTE_PREFIX}/skills/`.length))
            if (!name) {
              sendJson(res, 400, { ok: false, error: { message: '缺少 skill 名称' } })
              return
            }
            const deleted = await deleteSkill(name)
            if (!deleted) {
              sendJson(res, 404, { ok: false, error: { message: `Skill "${name}" 不存在` } })
              return
            }
            sendJson(res, 200, { ok: true })
            return
          }

          sendJson(res, 404, { ok: false, error: { message: `未找到接口：${req.method} ${pathname}` } })
        } catch (err) {
          if (ctx.logger) ctx.logger.warn(`[skill-manager] request failed: ${err?.message ?? err}`)
          sendJson(res, 500, { ok: false, error: { message: String(err?.message ?? err) } })
        }
      },
    }), 'dsh-skill-manager: routes')
  },
}
