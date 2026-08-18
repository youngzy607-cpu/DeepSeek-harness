import { useEffect, useState, useCallback } from 'react'
import type { CSSProperties } from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'

const NS = 'skill-manager'

const zh = {
  'tab': 'Skill 管理',
  'title': 'Skill 管理',
  'hint': '管理 ~/.dsh/skills/ 下的 Skill 文件。Harness 会自动监视变更，新增或修改后即时生效。',
  'openFolder': '打开文件夹',
  'new': '新建 Skill',
  'loading': '正在读取 Skill 列表…',
  'loadError': '读取失败',
  'retry': '重试',
  'empty': '暂无 Skill。点击「新建 Skill」创建第一个。',
  'name': '名称',
  'namePlaceholder': 'kebab-case，如 my-skill',
  'description': '描述',
  'descriptionPlaceholder': '这个 Skill 做什么',
  'whenToUse': '何时使用',
  'whenToUsePlaceholder': '可选，描述使用时机',
  'format': '格式',
  'formatFlat': '扁平文件（name.md）',
  'formatBundle': '目录（name/SKILL.md）',
  'body': '正文',
  'bodyPlaceholder': 'Skill 的指令正文…\n\n例如：\n## 步骤\n1. 分析需求\n2. 生成代码\n3. 验证结果',
  'save': '保存',
  'saving': '保存中…',
  'saved': '已保存',
  'saveError': '保存失败',
  'delete': '删除',
  'deleteConfirm': '确定删除此 Skill？',
  'deleteError': '删除失败',
  'edit': '编辑',
  'cancel': '取消',
  'back': '返回列表',
  'nameRequired': '名称不能为空',
  'nameInvalid': '名称必须为 kebab-case（小写字母、数字、连字符）',
  'chars': '字符',
}

const en = {
  'tab': 'Skill Manager',
  'title': 'Skill Manager',
  'hint': 'Manage Skill files under ~/.dsh/skills/. Harness watches for changes automatically — new or edited skills take effect immediately.',
  'openFolder': 'Open Folder',
  'new': 'New Skill',
  'loading': 'Loading skills…',
  'loadError': 'Failed to load',
  'retry': 'Retry',
  'empty': 'No skills yet. Click "New Skill" to create one.',
  'name': 'Name',
  'namePlaceholder': 'kebab-case, e.g. my-skill',
  'description': 'Description',
  'descriptionPlaceholder': 'What this skill does',
  'whenToUse': 'When to use',
  'whenToUsePlaceholder': 'Optional, describe when to use this skill',
  'format': 'Format',
  'formatFlat': 'Flat file (name.md)',
  'formatBundle': 'Directory (name/SKILL.md)',
  'body': 'Body',
  'bodyPlaceholder': 'Skill instruction body…\n\nExample:\n## Steps\n1. Analyze request\n2. Generate code\n3. Verify results',
  'save': 'Save',
  'saving': 'Saving…',
  'saved': 'Saved',
  'saveError': 'Save failed',
  'delete': 'Delete',
  'deleteConfirm': 'Delete this skill?',
  'deleteError': 'Delete failed',
  'edit': 'Edit',
  'cancel': 'Cancel',
  'back': 'Back to list',
  'nameRequired': 'Name is required',
  'nameInvalid': 'Name must be kebab-case (lowercase letters, digits, hyphens)',
  'chars': 'characters',
}

const panelStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  maxWidth: 820,
}

const hintStyle: CSSProperties = {
  margin: 0,
  fontSize: 12,
  color: 'var(--text-muted-color, #999)',
  lineHeight: 1.6,
}

const buttonStyle: CSSProperties = {
  padding: '6px 14px',
  borderRadius: 8,
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

const dangerButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: '#e03131',
  borderColor: 'transparent',
  color: '#fff',
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

const descStyle: CSSProperties = {
  margin: '2px 0 0',
  fontSize: 12,
  color: 'var(--text-muted-color, #999)',
}

const badgeStyle: CSSProperties = {
  fontSize: 10,
  padding: '1px 7px',
  borderRadius: 999,
  color: '#fff',
  background: '#868e96',
}

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '6px 10px',
  borderRadius: 8,
  border: '1px solid var(--line-color, rgba(127,127,127,.35))',
  background: 'var(--bg-color, #fff)',
  color: 'var(--text-color, #333)',
  fontSize: 13,
  boxSizing: 'border-box' as const,
  outline: 'none',
}

const textareaStyle: CSSProperties = {
  ...inputStyle,
  minHeight: 240,
  fontFamily: 'var(--mono-font, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace)',
  lineHeight: 1.7,
  resize: 'vertical' as const,
}

const labelStyle: CSSProperties = {
  fontSize: 12.5,
  fontWeight: 600,
  color: 'var(--text-color, #333)',
  marginBottom: 4,
  display: 'block',
}

const statusStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--text-muted-color, #999)',
}

// ── API ──────────────────────────────────────────────────────────────────────

type Skill = {
  name: string
  dirName: string
  description: string
  whenToUse: string
  format: 'flat' | 'bundle'
}

type SkillDetail = {
  frontmatter: { name?: string; description?: string; whenToUse?: string }
  body: string
  format: 'flat' | 'bundle'
  dirName: string
}

async function fetchSkills(): Promise<Skill[]> {
  const res = await fetch('/skill-manager', { cache: 'no-store' })
  const payload = await res.json() as { ok?: boolean; skills?: Skill[]; error?: { message?: string } }
  if (payload.ok !== true || !Array.isArray(payload.skills)) {
    throw new Error(payload.error?.message ?? 'fetch failed')
  }
  return payload.skills
}

async function fetchSkill(name: string): Promise<SkillDetail | null> {
  const res = await fetch(`/skill-manager/skills/${encodeURIComponent(name)}`, { cache: 'no-store' })
  const payload = await res.json() as { ok?: boolean; skill?: SkillDetail; error?: { message?: string } }
  if (payload.ok !== true) {
    if (res.status === 404) return null
    throw new Error(payload.error?.message ?? 'fetch failed')
  }
  return payload.skill!
}

async function saveSkill(name: string, data: { frontmatter: Record<string, string>; body: string; format: string }): Promise<void> {
  const res = await fetch(`/skill-manager/skills/${encodeURIComponent(name)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const payload = await res.json() as { ok?: boolean; error?: { message?: string } }
  if (payload.ok !== true) {
    throw new Error(payload.error?.message ?? 'save failed')
  }
}

async function deleteSkill(name: string): Promise<void> {
  const res = await fetch(`/skill-manager/skills/${encodeURIComponent(name)}`, { method: 'DELETE' })
  const payload = await res.json() as { ok?: boolean; error?: { message?: string } }
  if (payload.ok !== true) {
    throw new Error(payload.error?.message ?? 'delete failed')
  }
}

async function openFolder(): Promise<void> {
  await fetch('/skill-manager/open-folder', { method: 'POST' })
}

// ── List View ─────────────────────────────────────────────────────────────────

function SkillList({ t, onEdit, onNew, reloadKey }: {
  t: (k: string) => string
  onEdit: (name: string) => void
  onNew: () => void
  reloadKey: number
}) {
  const [skills, setSkills] = useState<Skill[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = useCallback(() => {
    setStatus('loading')
    fetchSkills().then(
      (s) => { setSkills(s); setStatus('ready') },
      (err) => { setErrorMsg(err instanceof Error ? err.message : String(err)); setStatus('error') },
    )
  }, [])

  useEffect(load, [load, reloadKey])

  const handleDelete = async (name: string) => {
    if (!window.confirm(t('deleteConfirm'))) return
    setDeleting(name)
    try {
      await deleteSkill(name)
      load()
    } catch (err) {
      window.alert(`${t('deleteError')}：${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={hintStyle}>{t('hint')}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" style={buttonStyle} onClick={() => { void openFolder() }}>{t('openFolder')}</button>
          <button type="button" style={primaryButtonStyle} onClick={onNew}>{t('new')}</button>
        </div>
      </div>

      {status === 'loading' && <p style={statusStyle}>{t('loading')}</p>}
      {status === 'error' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <p style={{ ...statusStyle, color: '#c92a2a' }} role="alert">{t('loadError')}：{errorMsg}</p>
          <button type="button" style={buttonStyle} onClick={load}>{t('retry')}</button>
        </div>
      )}
      {status === 'ready' && skills.length === 0 && <p style={statusStyle}>{t('empty')}</p>}
      {status === 'ready' && skills.map((skill) => (
        <section key={skill.dirName} style={cardStyle}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h4 style={nameStyle}>{skill.name}</h4>
              <span style={badgeStyle}>{skill.format === 'bundle' ? 'dir' : 'file'}</span>
            </div>
            <p style={descStyle}>{skill.description || `~/.dsh/skills/${skill.dirName}${skill.format === 'bundle' ? '/SKILL.md' : '.md'}`}</p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" style={buttonStyle} onClick={() => onEdit(skill.dirName)}>{t('edit')}</button>
            <button
              type="button"
              style={dangerButtonStyle}
              disabled={deleting === skill.dirName}
              onClick={() => { void handleDelete(skill.dirName) }}
            >
              {deleting === skill.dirName ? '…' : t('delete')}
            </button>
          </div>
        </section>
      ))}
    </div>
  )
}

// ── Editor View ───────────────────────────────────────────────────────────────

function SkillEditor({ t, skillName, onBack }: {
  t: (k: string) => string
  skillName: string | null
  onBack: () => void
}) {
  const isNew = skillName === null
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [whenToUse, setWhenToUse] = useState('')
  const [format, setFormat] = useState<'flat' | 'bundle'>('flat')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<'loading' | 'ready' | 'saving' | 'saved' | 'saveError'>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (isNew) {
      setName('')
      setDescription('')
      setWhenToUse('')
      setFormat('flat')
      setBody('')
      setStatus('ready')
      return
    }
    setStatus('loading')
    fetchSkill(skillName!).then(
      (detail) => {
        if (!detail) { setStatus('ready'); return }
        setName(detail.frontmatter.name || skillName || '')
        setDescription(detail.frontmatter.description || '')
        setWhenToUse(detail.frontmatter.whenToUse || '')
        setFormat(detail.format)
        setBody(detail.body)
        setStatus('ready')
      },
      (err) => { setErrorMsg(err instanceof Error ? err.message : String(err)); setStatus('saveError') },
    )
  }, [skillName, isNew])

  const nameValid = name.length > 0 && /^[a-z0-9][a-z0-9-]*$/.test(name)
  const dirty = status === 'ready' || status === 'saved' || status === 'saveError'

  const handleSave = async () => {
    if (!nameValid) return
    setStatus('saving')
    try {
      await saveSkill(name, {
        frontmatter: { name, description, whenToUse },
        body,
        format,
      })
      setStatus('saved')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err))
      setStatus('saveError')
    }
  }

  const statusText = (() => {
    if (status === 'loading') return t('loading')
    if (status === 'saving') return t('saving')
    if (status === 'saved') return t('saved')
    if (status === 'saveError') return `${t('saveError')}：${errorMsg}`
    if (!nameValid && name.length > 0) return t('nameInvalid')
    if (body.length === 0) return t('bodyPlaceholder').split('\n')[0]
    return `${body.length} ${t('chars')}`
  })()

  const statusColor = status === 'saveError'
    ? '#c92a2a'
    : status === 'saved'
      ? '#2f9e44'
      : 'var(--text-muted-color, #999)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button type="button" style={buttonStyle} onClick={onBack}>{t('back')}</button>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{isNew ? t('new') : t('edit')}</h3>
      </div>

      {status === 'loading' && <p style={statusStyle}>{t('loading')}</p>}

      {status !== 'loading' && (
        <>
          <div>
            <label style={labelStyle}>{t('name')}</label>
            <input
              style={inputStyle}
              value={name}
              placeholder={t('namePlaceholder')}
              onChange={(e) => { setName(e.target.value.toLowerCase()); if (status === 'saved' || status === 'saveError') setStatus('ready') }}
              disabled={!isNew}
            />
          </div>

          <div>
            <label style={labelStyle}>{t('description')}</label>
            <input
              style={inputStyle}
              value={description}
              placeholder={t('descriptionPlaceholder')}
              onChange={(e) => { setDescription(e.target.value); if (status === 'saved') setStatus('ready') }}
            />
          </div>

          <div>
            <label style={labelStyle}>{t('whenToUse')}</label>
            <input
              style={inputStyle}
              value={whenToUse}
              placeholder={t('whenToUsePlaceholder')}
              onChange={(e) => { setWhenToUse(e.target.value); if (status === 'saved') setStatus('ready') }}
            />
          </div>

          <div>
            <label style={labelStyle}>{t('format')}</label>
            <div style={{ display: 'flex', gap: 12, fontSize: 12.5 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                <input type="radio" checked={format === 'flat'} onChange={() => setFormat('flat')} />
                {t('formatFlat')}
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                <input type="radio" checked={format === 'bundle'} onChange={() => setFormat('bundle')} />
                {t('formatBundle')}
              </label>
            </div>
          </div>

          <div>
            <label style={labelStyle}>{t('body')}</label>
            <textarea
              style={textareaStyle}
              value={body}
              placeholder={t('bodyPlaceholder')}
              onChange={(e) => { setBody(e.target.value); if (status === 'saved') setStatus('ready') }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ ...statusStyle, color: statusColor }}>{statusText}</span>
            <button
              type="button"
              style={status === 'saving' || !nameValid ? { ...primaryButtonStyle, opacity: 0.5, cursor: 'not-allowed' } : primaryButtonStyle}
              disabled={status === 'saving' || !nameValid}
              onClick={() => { void handleSave() }}
            >
              {status === 'saving' ? t('saving') : t('save')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export type SkillManagerTabProps = PropsRuntime<'settings.plugins.tab'>

export function SkillManagerTab({ t }: SkillManagerTabProps): JSX.Element {
  const [view, setView] = useState<{ mode: 'list' } | { mode: 'edit'; name: string | null }>({ mode: 'list' })
  const [reloadKey, setReloadKey] = useState(0)

  const goList = () => {
    setView({ mode: 'list' })
    setReloadKey((k) => k + 1)
  }

  return (
    <div style={panelStyle}>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{t('title')}</h3>
      {view.mode === 'list' && (
        <SkillList
          t={t}
          reloadKey={reloadKey}
          onEdit={(name) => setView({ mode: 'edit', name })}
          onNew={() => setView({ mode: 'edit', name: null })}
        />
      )}
      {view.mode === 'edit' && (
        <SkillEditor
          t={t}
          skillName={view.name}
          onBack={goList}
        />
      )}
    </div>
  )
}

export const inject = ['slots', 'locale']

export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-skill-manager: copy')
  const t = ctx.locale.bind(NS)
  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'skill-manager',
    order: 15,
    label: () => t('tab'),
    locale: NS,
  }, SkillManagerTab))
}
