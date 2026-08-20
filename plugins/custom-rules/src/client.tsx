import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'

const NS = 'custom-rules'

const zh = {
  'tab': '自定义规则',
  'title': '全局自定义规则',
  'hint': '此处编辑的内容会保存到 ~/.dsh/AGENTS.md，Harness 在每次会话开始时自动加载并遵守这些规则。规则不会覆盖系统、开发者或直接用户指令。',
  'placeholder': '在此输入你的自定义规则…\n\n例如：\n- 每次回复用中文\n- 代码注释用英文\n- 优先使用函数式风格',
  'loading': '正在读取规则…',
  'loadError': '读取规则失败',
  'retry': '重试',
  'save': '保存',
  'saving': '保存中…',
  'saved': '已保存',
  'saveError': '保存失败',
  'unsaved': '有未保存的更改',
  'chars': '字符',
  'empty': '当前没有自定义规则。输入内容后点击保存即可生效。',
}

const en = {
  'tab': 'Custom Rules',
  'title': 'Global Custom Rules',
  'hint': 'Content here is saved to ~/.dsh/AGENTS.md. Harness loads and follows these rules at the start of every session. They do not override system, developer, or direct user instructions.',
  'placeholder': 'Type your custom rules here…\n\nExample:\n- Always respond in English\n- Write code comments in English\n- Prefer functional style',
  'loading': 'Loading rules…',
  'loadError': 'Failed to load rules',
  'retry': 'Retry',
  'save': 'Save',
  'saving': 'Saving…',
  'saved': 'Saved',
  'saveError': 'Save failed',
  'unsaved': 'Unsaved changes',
  'chars': 'characters',
  'empty': 'No custom rules set. Type something and click Save to activate.',
}

const panelStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  maxWidth: 760,
}

const hintStyle: CSSProperties = {
  margin: 0,
  fontSize: 12,
  color: 'var(--text-muted-color, #999)',
  lineHeight: 1.6,
}

const editorStyle: CSSProperties = {
  width: '100%',
  minHeight: 320,
  padding: '12px 14px',
  borderRadius: 10,
  border: '1px solid var(--line-color, rgba(127,127,127,.25))',
  background: 'var(--bg-color, #fff)',
  color: 'var(--text-color, #333)',
  fontSize: 13.5,
  fontFamily: 'var(--mono-font, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace)',
  lineHeight: 1.7,
  resize: 'vertical',
  boxSizing: 'border-box',
  outline: 'none',
}

const buttonStyle: CSSProperties = {
  padding: '6px 18px',
  borderRadius: 8,
  border: '1px solid transparent',
  background: 'var(--primary-color, #4d6bfe)',
  color: '#fff',
  fontSize: 13,
  cursor: 'pointer',
}

const disabledButtonStyle: CSSProperties = {
  ...buttonStyle,
  opacity: 0.5,
  cursor: 'not-allowed',
}

const statusStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--text-muted-color, #999)',
}

async function fetchRules(): Promise<string> {
  const res = await fetch('/custom-rules', { cache: 'no-store' })
  const payload = await res.json() as { ok?: boolean, content?: string, error?: { message?: string } }
  if (payload.ok !== true || typeof payload.content !== 'string') {
    throw new Error(payload.error?.message ?? 'fetch failed')
  }
  return payload.content
}

async function saveRules(content: string): Promise<void> {
  const res = await fetch('/custom-rules', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  const payload = await res.json() as { ok?: boolean, error?: { message?: string } }
  if (payload.ok !== true) {
    throw new Error(payload.error?.message ?? 'save failed')
  }
}

export type CustomRulesTabProps = PropsRuntime<'settings.plugins.tab'>

export function CustomRulesTab({ t }: CustomRulesTabProps): JSX.Element {
  const [savedContent, setSavedContent] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'saving' | 'saved' | 'saveError'>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  const load = () => {
    setStatus('loading')
    fetchRules().then(
      (content) => {
        setSavedContent(content)
        setDraft(content)
        setStatus('ready')
      },
      (err) => {
        setErrorMsg(err instanceof Error ? err.message : String(err))
        setStatus('error')
      },
    )
  }

  useEffect(load, [])

  const dirty = savedContent !== null && draft !== savedContent

  const save = async () => {
    setStatus('saving')
    try {
      await saveRules(draft)
      setSavedContent(draft)
      setStatus('saved')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err))
      setStatus('saveError')
    }
  }

  const statusText = (() => {
    if (status === 'loading') return t('loading')
    if (status === 'error') return `${t('loadError')}：${errorMsg}`
    if (status === 'saving') return t('saving')
    if (status === 'saved') return t('saved')
    if (status === 'saveError') return `${t('saveError')}：${errorMsg}`
    if (dirty) return t('unsaved')
    if (draft.length === 0) return t('empty')
    return `${draft.length} ${t('chars')}`
  })()

  const statusColor = status === 'error' || status === 'saveError'
    ? '#c92a2a'
    : status === 'saved'
      ? '#2f9e44'
      : dirty
        ? '#e8590c'
        : 'var(--text-muted-color, #999)'

  return (
    <div style={panelStyle}>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{t('title')}</h3>
      <p style={hintStyle}>{t('hint')}</p>

      {status === 'loading' && (
        <p style={statusStyle}>{t('loading')}</p>
      )}

      {status === 'error' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <p style={{ ...statusStyle, color: '#c92a2a' }} role="alert">{t('loadError')}：{errorMsg}</p>
          <button type="button" style={{ ...buttonStyle, background: 'var(--bg2-color, rgba(127,127,127,.12))', color: 'var(--text-color, #333)', borderColor: 'var(--line-color, rgba(127,127,127,.35))' }} onClick={load}>{t('retry')}</button>
        </div>
      )}

      {status !== 'loading' && status !== 'error' && (
        <>
          <textarea
            style={editorStyle}
            value={draft}
            placeholder={t('placeholder')}
            onChange={(e) => {
              setDraft(e.target.value)
              if (status === 'saved' || status === 'saveError') setStatus('ready')
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ ...statusStyle, color: statusColor }}>{statusText}</span>
            <button
              type="button"
              style={status === 'saving' ? disabledButtonStyle : buttonStyle}
              disabled={status === 'saving' || !dirty}
              onClick={() => { void save() }}
            >
              {status === 'saving' ? t('saving') : t('save')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export const inject = ['slots', 'locale']

export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-custom-rules: copy')
  const t = ctx.locale.bind(NS)
  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'custom-rules',
    order: 10,
    label: () => t('tab'),
    locale: NS,
  }, CustomRulesTab))
}
