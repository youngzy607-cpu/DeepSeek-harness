/**
 * dsh-plugin-manager — 浏览器半边
 *
 * 在 Plugins 设置区新增“我的插件”标签页：
 *  - 列出受管自定义插件（默认 usage-monitor）
 *  - 提供“启用 / 停用”按钮
 *
 * 数据来自 Host 端接口：
 *  - GET  /plugin-manager/plugins
 *  - POST /plugin-manager/plugins/:id
 */
import { useEffect, useState } from 'react'
import type { CSSProperties, JSX } from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'

// ---------------------------------------------------------------------------
// 文案
// ---------------------------------------------------------------------------

export const NS = 'plugin-manager'

export const zh = {
  'tab': '我的插件',
  'loading': '正在读取插件…',
  'error': '暂时无法读取插件状态。',
  'retry': '重试',
  'empty': '暂无可管理的自定义插件。',
  'missing': '未找到配置',
  'enabled': '已启用',
  'disabled': '已停用',
  'enable': '启用',
  'disable': '停用',
  'operating': '处理中…',
  'operateError': '操作失败',
  'hint': '这里只管理你在 cordis.patch.yml 中配置的自定义插件。',
} as const

export type PluginManagerKey = keyof typeof zh

export const en: Record<PluginManagerKey, string> = {
  'tab': 'My Plugins',
  'loading': 'Loading plugins…',
  'error': 'Unable to load plugin states.',
  'retry': 'Retry',
  'empty': 'No manageable custom plugins.',
  'missing': 'Not found',
  'enabled': 'Enabled',
  'disabled': 'Disabled',
  'enable': 'Enable',
  'disable': 'Disable',
  'operating': 'Working…',
  'operateError': 'Operation failed',
  'hint': 'Only custom plugins configured in cordis.patch.yml are managed here.',
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** 自定义插件启停管理文案。 */
    'plugin-manager': PluginManagerKey
  }
}

// ---------------------------------------------------------------------------
// 数据
// ---------------------------------------------------------------------------

export interface ManagedPlugin {
  id: string
  name: string | null
  exists: boolean
  enabled: boolean
  phase: 'pending' | 'loading' | 'active' | 'failed' | 'unloading' | null
}

interface ListPayload {
  ok?: boolean
  plugins?: ManagedPlugin[]
  error?: { message?: string }
}

interface TogglePayload {
  ok?: boolean
  error?: { message?: string }
}

async function listPlugins(): Promise<ManagedPlugin[]> {
  const res = await fetch('/plugin-manager/plugins', { cache: 'no-store' })
  const payload = (await res.json()) as ListPayload
  if (payload.ok !== true || !Array.isArray(payload.plugins)) {
    throw new Error(payload.error?.message ?? 'list failed')
  }
  return payload.plugins
}

async function setPluginEnabled(id: string, enabled: boolean): Promise<void> {
  const res = await fetch(`/plugin-manager/plugins/${encodeURIComponent(id)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled }),
  })
  const payload = (await res.json()) as TogglePayload
  if (payload.ok !== true) {
    throw new Error(payload.error?.message ?? 'toggle failed')
  }
}

// ---------------------------------------------------------------------------
// 组件
// ---------------------------------------------------------------------------

export type PluginManagerTabProps =
  PropsRuntime<'settings.plugins.tab'> & PropsLocale<typeof NS>

const sectionStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  maxWidth: 760,
  color: 'var(--text-color, #333)',
}

const hintStyle: CSSProperties = {
  margin: 0,
  fontSize: 12,
  color: 'var(--text-muted-color, #999)',
  lineHeight: 1.6,
}

const cardStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '12px 14px',
  border: '1px solid var(--line-color, rgba(127,127,127,.25))',
  borderRadius: 10,
  background: 'var(--bg2-color, rgba(127,127,127,.06))',
}

const nameStyle: CSSProperties = {
  margin: 0,
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--text-color, #333)',
}

const idStyle: CSSProperties = {
  margin: '2px 0 0',
  fontSize: 12,
  color: 'var(--text-muted-color, #999)',
}

const badgeStyle: CSSProperties = {
  fontSize: 11,
  padding: '1px 8px',
  borderRadius: 999,
  color: '#fff',
  background: '#868e96',
}

const buttonStyle: CSSProperties = {
  padding: '4px 14px',
  borderRadius: 6,
  border: '1px solid var(--line-color, rgba(127,127,127,.35))',
  background: 'var(--bg2-color, rgba(127,127,127,.12))',
  color: 'var(--text-color, #333)',
  fontSize: 12.5,
  cursor: 'pointer',
}

const primaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: 'var(--primary-color, #4d6bfe)',
  borderColor: 'transparent',
  color: '#fff',
}

const statusStyle: CSSProperties = {
  margin: 0,
  fontSize: 12,
  color: 'var(--text-muted-color, #999)',
}

export function PluginManagerTab({ t }: PluginManagerTabProps): JSX.Element {
  const [state, setState] = useState<
    { status: 'loading' }
    | { status: 'error'; message?: string }
    | { status: 'ready'; plugins: ManagedPlugin[] }
  >({ status: 'loading' })
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = (): void => {
    setState({ status: 'loading' })
    listPlugins().then(
      (plugins) => setState({ status: 'ready', plugins }),
      (err: unknown) => setState({
        status: 'error',
        message: err instanceof Error ? err.message : String(err),
      }),
    )
  }

  useEffect(load, [])

  const toggle = async (plugin: ManagedPlugin, enabled: boolean): Promise<void> => {
    setBusyId(plugin.id)
    setError(null)
    try {
      await setPluginEnabled(plugin.id, enabled)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div style={sectionStyle} aria-busy={state.status === 'loading'}>
      {state.status === 'loading' && <p style={statusStyle}>{t('loading')}</p>}
      {state.status === 'error' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <p style={{ ...statusStyle, color: '#c92a2a' }} role="alert">{t('error')}</p>
          <button type="button" style={buttonStyle} onClick={load}>{t('retry')}</button>
        </div>
      )}
      {error && (
        <p style={{ ...statusStyle, color: '#c92a2a' }} role="alert">
          {t('operateError')}：{error}
        </p>
      )}
      {state.status === 'ready' && state.plugins.length === 0 && (
        <p style={statusStyle}>{t('empty')}</p>
      )}
      {state.status === 'ready' && state.plugins.map((plugin) => {
        const enabled = plugin.enabled
        const busy = busyId === plugin.id
        return (
          <section key={plugin.id} style={cardStyle}>
            <div>
              <h4 style={nameStyle}>{plugin.name ?? plugin.id}</h4>
              <p style={idStyle}>{plugin.id}</p>
              {!plugin.exists && <p style={{ ...idStyle, color: '#c92a2a' }}>{t('missing')}</p>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                ...badgeStyle,
                background: enabled ? '#2f9e44' : '#868e96',
              }}>
                {enabled ? t('enabled') : t('disabled')}
              </span>
              {enabled ? (
                <button
                  type="button"
                  style={buttonStyle}
                  disabled={busy || !plugin.exists}
                  onClick={() => { void toggle(plugin, false) }}
                >
                  {busy ? t('operating') : t('disable')}
                </button>
              ) : (
                <button
                  type="button"
                  style={primaryButtonStyle}
                  disabled={busy || !plugin.exists}
                  onClick={() => { void toggle(plugin, true) }}
                >
                  {busy ? t('operating') : t('enable')}
                </button>
              )}
            </div>
          </section>
        )
      })}
      <p style={hintStyle}>{t('hint')}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 插件主体
// ---------------------------------------------------------------------------

export const inject = ['slots', 'locale']

export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-plugin-manager: copy')

  const t = ctx.locale.bind(NS)

  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'managed',
    order: 20,
    label: () => t('tab'),
    locale: NS,
  }, PluginManagerTab))
}
