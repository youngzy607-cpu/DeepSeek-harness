/**
 * dsh-usage-monitor — Host 半边
 *
 * 注册 GET /usage-monitor/balance：用 Harness 现有凭据（DEEPSEEK_API_KEY）
 * 调 DeepSeek 官方余额接口，把结果以 JSON 返回给浏览器。
 * 密钥只在本地服务端使用，不进入浏览器。
 *
 * 该模块刻意零依赖：不 import 任何包，服务通过 cordis 的 `inject` 声明获取。
 */
const BALANCE_PATH = '/usage-monitor/balance'
const DEFAULT_BASE_URL = 'https://api.deepseek.com'
const REQUEST_TIMEOUT_MS = 15_000

/** 发送一个 JSON 响应。 */
function sendJson(res, status, body) {
  const data = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  res.end(data)
}

/**
 * cordis 插件：对象形态（{ name, inject, apply }）。
 * inject 声明 webServer（dsh-host-webserver）与 credentials（dsh-credentials），
 * 两者就绪后 apply 才会执行，`ctx.webServer` / `ctx.credentials` 可直接访问。
 */
export default {
  name: 'dsh-usage-monitor',

  inject: ['webServer', 'credentials'],

  /**
   * @param ctx - cordis 上下文
   * @param config - Loader 条目 config（可含 baseUrl，默认官方地址）
   */
  apply(ctx, config) {
    const baseUrl = (
      config && typeof config.baseUrl === 'string' && config.baseUrl.trim() !== ''
    ) ? config.baseUrl.trim().replace(/\/+$/, '') : DEFAULT_BASE_URL
    const endpoint = `${baseUrl}/user/balance`

    ctx.effect(() => ctx.webServer.register({
      kind: 'exact',
      path: BALANCE_PATH,
      handler: async (req, res) => {
        try {
          const hit = await ctx.credentials.resolve('DEEPSEEK_API_KEY')
          if (!hit || typeof hit.value !== 'string' || hit.value === '') {
            sendJson(res, 200, {
              ok: false,
              error: {
                kind: 'no-credential',
                message: 'DEEPSEEK_API_KEY 未配置（请在 Harness 设置中配置 API Key）',
              },
            })
            return
          }
          const upstream = await fetch(endpoint, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${hit.value}`,
              Accept: 'application/json',
            },
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
          })
          const text = await upstream.text()
          if (upstream.status === 401) {
            sendJson(res, 200, {
              ok: false,
              error: { kind: 'unauthorized', message: 'API Key 无效或已过期' },
            })
            return
          }
          if (!upstream.ok) {
            sendJson(res, 200, {
              ok: false,
              error: {
                kind: 'upstream',
                status: upstream.status,
                message: text.slice(0, 200) || `上游返回 ${upstream.status}`,
              },
            })
            return
          }
          let parsed = null
          try {
            parsed = JSON.parse(text)
          } catch {
            // 保留 null，前端会显示解析失败
          }
          sendJson(res, 200, { ok: true, fetchedAt: Date.now(), data: parsed })
        } catch (err) {
          if (ctx.logger) ctx.logger.warn(`[usage-monitor] balance fetch failed: ${err?.message ?? err}`)
          sendJson(res, 200, {
            ok: false,
            error: { kind: 'network', message: String(err?.message ?? err) },
          })
        }
      },
    }), 'dsh-usage-monitor: balance route')
  },
}
