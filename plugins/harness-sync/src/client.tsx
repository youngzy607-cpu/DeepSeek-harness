import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'

type Action = 'status' | 'backup' | 'restore'

const panelStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 720 }
const buttonStyle: CSSProperties = { padding: '8px 14px', borderRadius: 8, border: '1px solid #aaa', cursor: 'pointer' }

async function request(action: Action): Promise<string> {
  const response = await fetch(`/harness-sync/${action}`, { method: action === 'status' ? 'GET' : 'POST' })
  const payload = await response.json() as { ok?: boolean, backup?: string, error?: { message?: string } }
  if (payload.ok !== true) throw new Error(payload.error?.message ?? '操作失败')
  if (action === 'restore') return `恢复完成。本机旧配置已备份到：${payload.backup}；请重启 Harness。`
  if (action === 'backup') return '备份并推送完成。'
  return '同步服务已就绪。'
}

export type HarnessSyncTabProps = PropsRuntime<'settings.plugins.tab'>

export function HarnessSyncTab(): JSX.Element {
  const [message, setMessage] = useState('正在读取同步状态…')
  const [busy, setBusy] = useState(false)

  const run = async (action: Action): Promise<void> => {
    setBusy(true)
    setMessage('处理中…')
    try { setMessage(await request(action)) } catch (error) { setMessage(`操作失败：${error instanceof Error ? error.message : String(error)}`) } finally { setBusy(false) }
  }

  useEffect(() => { void run('status') }, [])

  return <div style={panelStyle} aria-busy={busy}>
    <h3>配置同步</h3>
    <p>同步自定义插件与 Harness Web 配置；不会上传 API Key、凭据、会话或浏览器数据。</p>
    <p>{message}</p>
    <div style={{ display: 'flex', gap: 10 }}>
      <button type="button" style={buttonStyle} disabled={busy} onClick={() => void run('backup')}>备份到 Git</button>
      <button type="button" style={buttonStyle} disabled={busy} onClick={() => void run('restore')}>从 Git 恢复</button>
    </div>
  </div>
}

export const inject = ['slots']

export function apply(ctx: ClientContext): void {
  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'harness-sync',
    order: 30,
    label: () => '配置同步',
  }, HarnessSyncTab))
}
