import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'

type Action = 'backup' | 'restore'
type Step = { title: string, detail: string, state: 'running' | 'success' | 'failed' | 'skipped', error?: string }
type Operation = { id: string, kind: Action, state: 'running' | 'success' | 'failed', steps: Step[], backup?: string, plugins?: { directory: string }[], error?: string }

const panelStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 720 }
const buttonStyle: CSSProperties = { padding: '8px 14px', borderRadius: 8, border: '1px solid #aaa', cursor: 'pointer' }

async function status(): Promise<string> {
  const response = await fetch('/harness-sync/status')
  const payload = await response.json() as { ok?: boolean, error?: { message?: string } }
  if (payload.ok !== true) throw new Error(payload.error?.message ?? '操作失败')
  return '同步服务已就绪。'
}

async function start(action: Action): Promise<Operation> {
  const response = await fetch(`/harness-sync/operations/${action}`, { method: 'POST' })
  const payload = await response.json() as { ok?: boolean, operation?: Operation, error?: { message?: string } }
  if (payload.ok !== true || payload.operation === undefined) throw new Error(payload.error?.message ?? '无法启动同步任务')
  return payload.operation
}

async function readOperation(id: string): Promise<Operation> {
  const response = await fetch(`/harness-sync/operations/${id}`)
  const payload = await response.json() as { ok?: boolean, operation?: Operation, error?: { message?: string } }
  if (payload.ok !== true || payload.operation === undefined) throw new Error(payload.error?.message ?? '无法读取同步进度')
  return payload.operation
}

export type HarnessSyncTabProps = PropsRuntime<'settings.plugins.tab'>

export function HarnessSyncTab(): JSX.Element {
  const [message, setMessage] = useState('正在读取同步状态…')
  const [operation, setOperation] = useState<Operation | null>(null)
  const [busy, setBusy] = useState(false)

  const run = async (action: Action): Promise<void> => {
    setBusy(true)
    setMessage('已启动同步任务，正在公开每一步进度…')
    try {
      let current = await start(action)
      setOperation(current)
      while (current.state === 'running') {
        await new Promise(resolve => setTimeout(resolve, 600))
        current = await readOperation(current.id)
        setOperation(current)
      }
      setMessage(current.state === 'success' ? (action === 'restore' ? 'Git 同步完成，请重启 Harness。' : '备份与推送完成。') : `同步失败：${current.error ?? '请查看失败步骤。'}`)
    } catch (error) { setMessage(`操作失败：${error instanceof Error ? error.message : String(error)}`) } finally { setBusy(false) }
  }

  useEffect(() => { void status().then(setMessage, error => setMessage(`无法读取状态：${String(error)}`)) }, [])

  return <div style={panelStyle} aria-busy={busy}>
    <h3>配置同步</h3>
    <p>同步自定义插件与 Harness Web 配置；不会上传 API Key、凭据、会话或浏览器数据。</p>
    <p>{message}</p>
    <div style={{ display: 'flex', gap: 10 }}>
      <button type="button" style={buttonStyle} disabled={busy} onClick={() => void run('backup')}>备份到 Git</button>
      <button type="button" style={buttonStyle} disabled={busy} onClick={() => void run('restore')}>同步 Git</button>
    </div>
    {operation && <section style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
      <strong>{operation.kind === 'restore' ? 'Git 同步进度' : '备份进度'}</strong>
      <ol style={{ margin: '8px 0 0', paddingLeft: 20 }}>
        {operation.steps.map((step, index) => <li key={`${step.title}-${index}`} style={{ margin: '6px 0' }}>
          <b>{step.state === 'running' ? '处理中' : step.state === 'success' ? '完成' : step.state === 'skipped' ? '跳过' : '失败'}</b>：{step.title}<br />
          <span style={{ color: '#666' }}>{step.error ?? step.detail}</span>
        </li>)}
      </ol>
      {operation.plugins && <p style={{ margin: '12px 0 0' }}>本次插件：{operation.plugins.length ? operation.plugins.map(plugin => plugin.directory).join('、') : '无'}</p>}
    </section>}
    <p style={{ color: '#666', fontSize: 13 }}>安全说明：日志不会显示 API Key、令牌或凭据内容；已排除会话、浏览器缓存与依赖目录。</p>
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
