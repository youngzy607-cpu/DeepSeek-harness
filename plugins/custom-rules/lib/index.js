/**
 * dsh-custom-rules — Host 半边
 *
 * 注册 GET/POST /custom-rules：
 *  GET  — 读取 ~/.dsh/AGENTS.md 内容返回给前端
 *  POST — 原子写入用户编辑的规则文本到 ~/.dsh/AGENTS.md
 *
 * 该文件由内置 dsh-agent-instructions 在每个会话首步自动加载并注入，
 * 因此本插件只需提供编辑入口，无需自行注入 agent 指令。
 */
import { readFile, rename, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

const ROUTE_PATH = '/custom-rules'
const rulesPath = join(homedir(), '.dsh', 'AGENTS.md')

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
      if (raw.length > 512_000) {
        reject(new Error('请求体过大（上限 512 KB）'))
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

export default {
  name: 'dsh-custom-rules',

  inject: ['webServer'],

  apply(ctx) {
    ctx.effect(() => ctx.webServer.register({
      kind: 'exact',
      path: ROUTE_PATH,
      handler: async (req, res) => {
        try {
          if (req.method === 'GET') {
            let content = ''
            try {
              content = await readFile(rulesPath, 'utf8')
            } catch (err) {
              if (err.code !== 'ENOENT') throw err
            }
            sendJson(res, 200, { ok: true, content })
            return
          }

          if (req.method === 'POST') {
            const body = await readJsonBody(req)
            if (typeof body?.content !== 'string') {
              sendJson(res, 400, {
                ok: false,
                error: { message: '请求体需要 { "content": "..." }' },
              })
              return
            }
            await writeFileAtomic(rulesPath, body.content)
            sendJson(res, 200, { ok: true })
            return
          }

          sendJson(res, 404, {
            ok: false,
            error: { message: `未找到接口：${req.method} ${ROUTE_PATH}` },
          })
        } catch (err) {
          if (ctx.logger) ctx.logger.warn(`[custom-rules] request failed: ${err?.message ?? err}`)
          sendJson(res, 500, {
            ok: false,
            error: { message: String(err?.message ?? err) },
          })
        }
      },
    }), 'dsh-custom-rules: routes')
  },
}
