/**
 * dsh-usage-monitor — 浏览器半边
 *
 * 两个界面入口：
 *  1. 会话头部摘要（conversation.session.header.utilities）：余额 + 本会话累计 token + 本会话估算金额，实时更新
 *  2. 设置页「用量监控」面板（settings.section）：余额明细、全部会话汇总、费用估算、配置
 *
 * 数据来源：
 *  - 余额：GET /usage-monitor/balance（host 半边代理，复用 Harness 凭据，密钥不进入浏览器）
 *  - token 用量：Harness 内置 token-meter 的 `tokenUsage` 会话投影
 *    （session/projection 实时帧 + session.list 冷会话缓存行）
 *
 * 全部状态都在浏览器本地（localStorage），不向任何第三方发送数据。
 */
import { useMemo, useSyncExternalStore, useState } from 'react'
import type { CSSProperties, JSX } from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { TokenUsageProjection } from '@deepseek-ai/dsh-token-meter/projection'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'

// ---------------------------------------------------------------------------
// 文案（locale namespace：usage-monitor）
// ---------------------------------------------------------------------------

export const NS = 'usage-monitor'

/** DeepSeek 开放平台充值页。 */
export const RECHARGE_URL = 'https://platform.deepseek.com/top_up'

/** 简体中文字典（键集为唯一事实来源）。 */
export const zh = {
  'nav': '用量监控',
  'balance.title': '账户余额',
  'balance.available': '可用',
  'balance.unavailable': '不可用',
  'balance.total': '总余额',
  'balance.granted': '赠金',
  'balance.toppedUp': '充值',
  'balance.refresh': '刷新',
  'balance.refreshing': '刷新中…',
  'balance.lastUpdated': '更新于',
  'balance.empty': '暂无余额数据',
  'balance.noKey': '未配置 DEEPSEEK_API_KEY（请在 Harness 设置中配置 API Key）',
  'balance.unauthorized': 'API Key 无效或已过期',
  'balance.failed': '查询失败',
  'usage.title': 'Token 用量',
  'usage.all': '全部会话',
  'usage.today': '今日（近似）',
  'usage.sessions': '有用量记录的会话',
  'usage.input': '输入（未缓存）',
  'usage.output': '输出',
  'usage.cacheRead': '缓存读',
  'usage.cacheWrite': '缓存写',
  'usage.total': '合计',
  'usage.empty': '暂无用量数据',
  'cost.title': '费用估算',
  'cost.badge': '估算',
  'cost.hint': '按空闲时段基准价估算，高峰时段（北京时间 9-12 / 14-18 点）价格 ×2，仅供参考',
  'cost.model': '估算模型',
  'cost.custom': '自定义价格（元/百万 tokens）',
  'cost.hit': '输入·缓存命中',
  'cost.miss': '输入·缓存未命中',
  'cost.output': '输出',
  'config.title': '设置',
  'config.refreshInterval': '余额自动刷新间隔',
  'config.minutes': '分钟',
  'config.source': '数据来源：余额来自 DeepSeek 官方接口（凭据仅在本地服务端使用）；用量来自 Harness 本地会话记录。',
  'chip.balance': '余额',
  'chip.session': '本会话',
  'chip.amount': '金额',
  'chip.recharge': '余额不足，点击充值',
} as const

/** 英文字典，键与中文一致。 */
export const en: Record<UsageKey, string> = {
  'nav': 'Usage Monitor',
  'balance.title': 'Account Balance',
  'balance.available': 'Available',
  'balance.unavailable': 'Unavailable',
  'balance.total': 'Total balance',
  'balance.granted': 'Granted',
  'balance.toppedUp': 'Topped up',
  'balance.refresh': 'Refresh',
  'balance.refreshing': 'Refreshing…',
  'balance.lastUpdated': 'Updated',
  'balance.empty': 'No balance data',
  'balance.noKey': 'DEEPSEEK_API_KEY is not configured (set it in Harness settings)',
  'balance.unauthorized': 'API Key is invalid or expired',
  'balance.failed': 'Query failed',
  'usage.title': 'Token Usage',
  'usage.all': 'All sessions',
  'usage.today': 'Today (approx.)',
  'usage.sessions': 'Sessions with usage',
  'usage.input': 'Input (uncached)',
  'usage.output': 'Output',
  'usage.cacheRead': 'Cache read',
  'usage.cacheWrite': 'Cache write',
  'usage.total': 'Total',
  'usage.empty': 'No usage data yet',
  'cost.title': 'Cost Estimate',
  'cost.badge': 'estimate',
  'cost.hint': 'Estimated at off-peak base prices; peak hours (Beijing 9-12 / 14-18) cost ×2. For reference only.',
  'cost.model': 'Model for estimate',
  'cost.custom': 'Custom prices (CNY / 1M tokens)',
  'cost.hit': 'Input · cache hit',
  'cost.miss': 'Input · cache miss',
  'cost.output': 'Output',
  'config.title': 'Settings',
  'config.refreshInterval': 'Balance auto-refresh interval',
  'config.minutes': 'min',
  'config.source': 'Balance comes from the official DeepSeek API (credentials stay on the local host); usage comes from local Harness session records.',
  'chip.balance': 'Balance',
  'chip.session': 'Session',
  'chip.amount': 'Amount',
  'chip.recharge': 'Low balance, click to recharge',
}

/** 本插件 locale 命名空间的键域。 */
export type UsageKey = keyof typeof zh

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** 用量监控文案。 */
    'usage-monitor': UsageKey
  }
}

// ---------------------------------------------------------------------------
// 余额 store（本地 fetch /usage-monitor/balance，模块级单例）
// ---------------------------------------------------------------------------

interface BalanceInfo {
  currency: string
  total_balance: string
  granted_balance: string
  topped_up_balance: string
}

interface BalanceData {
  is_available: boolean
  balance_infos: BalanceInfo[]
}

type BalanceState =
  | { status: 'loading' }
  | { status: 'ok'; data: BalanceData; fetchedAt: number }
  | { status: 'error'; kind: string; message: string }

let balanceState: BalanceState = { status: 'loading' }
const balanceListeners = new Set<() => void>()

function emitBalance(): void {
  for (const listener of balanceListeners) listener()
}

export function subscribeBalance(listener: () => void): () => void {
  balanceListeners.add(listener)
  return () => { balanceListeners.delete(listener) }
}

export function getBalance(): BalanceState {
  return balanceState
}

/** 手动/定时刷新余额。 */
export async function refreshBalance(): Promise<void> {
  balanceState = { status: 'loading' }
  emitBalance()
  try {
    const res = await fetch('/usage-monitor/balance', { cache: 'no-store' })
    let json: unknown = null
    try {
      json = await res.json()
    } catch {
      // 非 JSON 响应
    }
    const payload = (json ?? {}) as {
      ok?: boolean
      fetchedAt?: number
      data?: BalanceData | null
      error?: { kind?: string; message?: string }
    }
    if (payload.ok === true && payload.data) {
      balanceState = { status: 'ok', data: payload.data, fetchedAt: payload.fetchedAt ?? Date.now() }
    } else {
      const err = payload.error ?? {}
      balanceState = {
        status: 'error',
        kind: err.kind ?? 'unknown',
        message: err.message ?? '未知错误',
      }
    }
  } catch (err) {
    balanceState = { status: 'error', kind: 'network', message: String(err) }
  }
  emitBalance()
}

// ---------------------------------------------------------------------------
// 配置 store（localStorage 持久化）
// ---------------------------------------------------------------------------

export interface PriceRow {
  /** 输入·缓存命中（元/百万 tokens） */
  hit: number
  /** 输入·缓存未命中（元/百万 tokens） */
  miss: number
  /** 输出（元/百万 tokens） */
  output: number
}

export interface UsageConfig {
  /** 余额自动刷新间隔（分钟） */
  refreshMinutes: number
  /** 估算所用价格：flash / pro / 自定义 */
  priceModel: 'flash' | 'pro' | 'custom'
  /** 自定义价格表 */
  custom: PriceRow
}

/** 官方价格（2026-08-17 起生效的空闲时段基准价，元/百万 tokens）。 */
export const OFFICIAL_PRICES: Record<'flash' | 'pro', PriceRow> = {
  flash: { hit: 0.05, miss: 1.5, output: 4.5 },
  pro: { hit: 0.15, miss: 4.5, output: 13.5 },
}

const DEFAULT_CONFIG: UsageConfig = {
  refreshMinutes: 5,
  priceModel: 'flash',
  custom: { ...OFFICIAL_PRICES.flash },
}

const CONFIG_KEY = 'dsh-usage-monitor.config'

function loadConfig(): UsageConfig {
  try {
    const raw = window.localStorage.getItem(CONFIG_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<UsageConfig> & { custom?: Partial<PriceRow> }
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        custom: { ...DEFAULT_CONFIG.custom, ...(parsed?.custom ?? {}) },
      }
    }
  } catch {
    // 损坏的配置用默认值
  }
  return { ...DEFAULT_CONFIG }
}

let config: UsageConfig = loadConfig()
const configListeners = new Set<() => void>()

function emitConfig(): void {
  for (const listener of configListeners) listener()
}

export function subscribeConfig(listener: () => void): () => void {
  configListeners.add(listener)
  return () => { configListeners.delete(listener) }
}

export function getConfig(): UsageConfig {
  return config
}

export function setConfig(patch: Partial<UsageConfig> & { custom?: Partial<PriceRow> }): void {
  config = {
    ...config,
    ...patch,
    custom: { ...config.custom, ...(patch.custom ?? {}) },
  }
  try {
    window.localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
  } catch {
    // 隐私模式等场景写入失败可忽略
  }
  emitConfig()
}

// ---------------------------------------------------------------------------
// 工具函数
// ---------------------------------------------------------------------------

/** 中文风格 token 数量格式化（万/亿）。 */
function fmtTokens(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return '0'
  if (n >= 1e8) return `${(n / 1e8).toFixed(2)}亿`
  if (n >= 1e4) return `${(n / 1e4).toFixed(1)}万`
  return n.toLocaleString('en-US')
}

/** 货币符号。 */
function currencySymbol(currency: string): string {
  switch (currency) {
    case 'CNY': return '¥'
    case 'USD': return '$'
    default: return `${currency} `
  }
}

/** 余额的紧凑展示（首个币种）。 */
function compactBalance(data: BalanceData): string {
  const first = data.balance_infos?.[0]
  if (!first || first.total_balance === undefined) return '—'
  return `${currencySymbol(first.currency)}${Number(first.total_balance).toFixed(2)}`
}

/** 会话投影 token 合计。 */
function sessionTotal(usage: TokenUsageProjection | undefined): number {
  if (!usage) return 0
  return usage.uncachedInputTokens + usage.outputTokens + usage.cacheReadTokens + usage.cacheWriteTokens
}

/** 北京时间的小时（0-23）与日期键（YYYY-MM-DD）。 */
function beijingParts(date: Date): { hour: number; day: string } {
  const hour = Number(
    new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Shanghai', hour: 'numeric', hour12: false })
      .formatToParts(date).find((part) => part.type === 'hour')?.value ?? '0',
  ) % 24
  const day = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(date)
  return { hour, day }
}

/** 高峰时段（北京时间 9-12 / 14-18 点）。 */
function isPeakHour(date: Date): boolean {
  const { hour } = beijingParts(date)
  return (hour >= 9 && hour < 12) || (hour >= 14 && hour < 18)
}

/** 费用估算（元）。缓存写默认免费。 */
function estimateCost(usage: TokenUsageProjection | undefined, cfg: UsageConfig, at: Date): number | null {
  if (!usage) return null
  const prices = cfg.priceModel === 'custom' ? cfg.custom : OFFICIAL_PRICES[cfg.priceModel]
  const multiplier = isPeakHour(at) ? 2 : 1
  return (
    (usage.uncachedInputTokens * prices.miss + usage.cacheReadTokens * prices.hit) * multiplier
    + usage.outputTokens * prices.output * multiplier
  ) / 1e6
}

interface Totals {
  uncached: number
  output: number
  cacheRead: number
  cacheWrite: number
  count: number
}

function emptyTotals(): Totals {
  return { uncached: 0, output: 0, cacheRead: 0, cacheWrite: 0, count: 0 }
}

function addTotals(totals: Totals, usage: TokenUsageProjection): Totals {
  return {
    uncached: totals.uncached + usage.uncachedInputTokens,
    output: totals.output + usage.outputTokens,
    cacheRead: totals.cacheRead + usage.cacheReadTokens,
    cacheWrite: totals.cacheWrite + usage.cacheWriteTokens,
    count: totals.count + 1,
  }
}

// ---------------------------------------------------------------------------
// 组件：会话头部摘要
// ---------------------------------------------------------------------------

export type UsageChipProps = PropsRuntime<'conversation.session.header.utilities'> & PropsLocale<typeof NS>

/**
 * 会话头部右侧的紧凑读数：余额 · 本会话 token · 本会话估算金额。
 * 数据随 tokenUsage 投影帧实时更新，余额随定时刷新更新。
 */
export function UsageChip({ useProjection, t }: UsageChipProps): JSX.Element | null {
  const usage = useProjection('tokenUsage')
  const balance = useSyncExternalStore(subscribeBalance, getBalance)
  const config = useSyncExternalStore(subscribeConfig, getConfig)
  const sessionCost = estimateCost(usage, config, new Date())

  const firstBalance = balance.status === 'ok' ? balance.data.balance_infos?.[0] : undefined
  const lowBalance = balance.status === 'ok' && !!firstBalance && firstBalance.currency === 'CNY'
    && Number.isFinite(Number(firstBalance.total_balance)) && Number(firstBalance.total_balance) < 1.5

  const chipStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '2px 8px',
    borderRadius: 999,
    fontSize: 12,
    lineHeight: '20px',
    color: lowBalance ? '#fff' : 'var(--text-color, #555)',
    background: lowBalance ? '#c92a2a' : 'var(--bg2-color, rgba(127,127,127,.12))',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
  }

  const tooltip = useMemo(() => {
    const lines: string[] = []
    if (lowBalance) {
      lines.push(t('chip.recharge'))
    }
    if (balance.status === 'ok') {
      for (const info of balance.data.balance_infos ?? []) {
        lines.push(`${t('balance.total')} ${currencySymbol(info.currency)}${Number(info.total_balance).toFixed(2)} · ${t('balance.granted')} ${Number(info.granted_balance).toFixed(2)} · ${t('balance.toppedUp')} ${Number(info.topped_up_balance).toFixed(2)}`)
      }
      lines.push(`${t('balance.lastUpdated')} ${new Date(balance.fetchedAt).toLocaleTimeString()}`)
    } else if (balance.status === 'error') {
      lines.push(`${t('balance.failed')}：${balance.message}`)
    }
    if (usage) {
      lines.push(`${t('usage.input')} ${fmtTokens(usage.uncachedInputTokens)} · ${t('usage.output')} ${fmtTokens(usage.outputTokens)} · ${t('usage.cacheRead')} ${fmtTokens(usage.cacheReadTokens)}`)
    }
    if (sessionCost !== null) {
      lines.push(`${t('chip.amount')} ¥${sessionCost.toFixed(2)}`)
    }
    return lines.join('\n')
  }, [balance, usage, config, sessionCost, t])

  const balanceText = balance.status === 'ok'
    ? `${t('chip.balance')} ${compactBalance(balance.data)}`
    : balance.status === 'error' ? `${t('chip.balance')} —` : ''

  return (
    <a
      href={RECHARGE_URL}
      target="_blank"
      rel="noreferrer"
      role="status"
      aria-live="polite"
      title={tooltip}
      style={chipStyle}
    >
      {balanceText ? <span>{balanceText}</span> : null}
      <span>{`${t('chip.session')} ${fmtTokens(sessionTotal(usage))}`}</span>
      {sessionCost !== null ? <span>{`${t('chip.amount')} ¥${sessionCost.toFixed(2)}`}</span> : null}
    </a>
  )
}

// ---------------------------------------------------------------------------
// 组件：设置页「用量监控」面板
// ---------------------------------------------------------------------------

export type UsageMonitorSectionProps =
  PropsRuntime<'settings.section'> & PropsLocale<typeof NS>

const cardStyle: CSSProperties = {
  border: '1px solid var(--line-color, rgba(127,127,127,.25))',
  borderRadius: 10,
  padding: '12px 14px',
  marginBottom: 14,
}

const cardTitleStyle: CSSProperties = {
  margin: '0 0 10px',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-color, #333)',
}

const rowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  padding: '4px 0',
  fontSize: 12.5,
  color: 'var(--text-color, #333)',
}

const mutedStyle: CSSProperties = {
  fontSize: 11.5,
  color: 'var(--text-muted-color, #999)',
  lineHeight: 1.6,
}

const badgeStyle: CSSProperties = {
  fontSize: 11,
  padding: '1px 8px',
  borderRadius: 999,
  color: '#fff',
  background: '#2f9e44',
}

const inputStyle: CSSProperties = {
  width: 76,
  padding: '2px 6px',
  borderRadius: 6,
  border: '1px solid var(--line-color, rgba(127,127,127,.35))',
  background: 'var(--bg-color, #fff)',
  color: 'var(--text-color, #333)',
  fontSize: 12.5,
}

const buttonStyle: CSSProperties = {
  padding: '3px 12px',
  borderRadius: 6,
  border: '1px solid var(--line-color, rgba(127,127,127,.35))',
  background: 'var(--bg2-color, rgba(127,127,127,.12))',
  color: 'var(--text-color, #333)',
  fontSize: 12.5,
  cursor: 'pointer',
}

function BalanceCard({ balance, t }: { balance: BalanceState; t: UsageMonitorSectionProps['t'] }): JSX.Element {
  return (
    <section style={cardStyle}>
      <h4 style={cardTitleStyle}>{t('balance.title')}</h4>
      {balance.status === 'loading' && <div style={rowStyle}>{t('balance.refreshing') ?? '…'}</div>}
      {balance.status === 'error' && (
        <div style={rowStyle}>
          <span style={{ color: '#c92a2a' }}>
            {balance.kind === 'no-credential' ? t('balance.noKey')
              : balance.kind === 'unauthorized' ? t('balance.unauthorized')
                : `${t('balance.failed')}：${balance.message}`}
          </span>
          <button style={buttonStyle} onClick={() => { void refreshBalance() }}>{t('balance.refresh')}</button>
        </div>
      )}
      {balance.status === 'ok' && (
        <>
          {balance.data.balance_infos.map((info) => (
            <div key={info.currency} style={rowStyle}>
              <span style={{ fontWeight: 600 }}>
                {currencySymbol(info.currency)}{Number(info.total_balance).toFixed(2)}
              </span>
              <span style={{ ...badgeStyle, background: balance.data.is_available ? '#2f9e44' : '#c92a2a' }}>
                {balance.data.is_available ? t('balance.available') : t('balance.unavailable')}
              </span>
            </div>
          ))}
          <div style={{ ...rowStyle, justifyContent: 'space-between' }}>
            <span style={mutedStyle}>
              {t('balance.granted')} {Number(balance.data.balance_infos[0]?.granted_balance ?? 0).toFixed(2)}
              {' · '}
              {t('balance.toppedUp')} {Number(balance.data.balance_infos[0]?.topped_up_balance ?? 0).toFixed(2)}
              {' · '}
              {t('balance.lastUpdated')} {new Date(balance.fetchedAt).toLocaleTimeString()}
            </span>
            <button style={buttonStyle} onClick={() => { void refreshBalance() }}>{t('balance.refresh')}</button>
          </div>
        </>
      )}
    </section>
  )
}

/**
 * 设置页「用量监控」面板：余额明细、全部会话 token 汇总、费用估算、配置。
 */
export function UsageMonitorSection({ useSessions, t }: UsageMonitorSectionProps): JSX.Element {
  const balance = useSyncExternalStore(subscribeBalance, getBalance)
  const config = useSyncExternalStore(subscribeConfig, getConfig)
  const byId = useSessions((state) => state.byId)
  const [tab, setTab] = useState<'all' | 'today'>('all')

  const totals = useMemo(() => {
    const rows = Object.values(byId)
    const all = rows.reduce<Totals>(
      (acc, row) => row.projectionValues?.tokenUsage
        ? addTotals(acc, row.projectionValues.tokenUsage)
        : acc,
      emptyTotals(),
    )
    const todayKey = beijingParts(new Date()).day
    const today = rows.reduce<Totals>(
      (acc, row) => {
        if (!row.projectionValues?.tokenUsage) return acc
        if (!row.updatedAt || beijingParts(new Date(row.updatedAt)).day !== todayKey) return acc
        return addTotals(acc, row.projectionValues.tokenUsage)
      },
      emptyTotals(),
    )
    return { all, today }
  }, [byId])

  const current = tab === 'all' ? totals.all : totals.today
  const cost = estimateCost(
    tab === 'all'
      ? { uncachedInputTokens: totals.all.uncached, outputTokens: totals.all.output, cacheReadTokens: totals.all.cacheRead, cacheWriteTokens: totals.all.cacheWrite }
      : { uncachedInputTokens: totals.today.uncached, outputTokens: totals.today.output, cacheReadTokens: totals.today.cacheRead, cacheWriteTokens: totals.today.cacheWrite },
    config,
    new Date(),
  )

  const tabStyle = (active: boolean): CSSProperties => ({
    padding: '3px 12px',
    borderRadius: 999,
    border: '1px solid var(--line-color, rgba(127,127,127,.35))',
    background: active ? 'var(--primary-color, #4d6bfe)' : 'transparent',
    color: active ? '#fff' : 'var(--text-color, #333)',
    fontSize: 12,
    cursor: 'pointer',
  })

  const usageRows: Array<{ label: string; value: number }> = [
    { label: t('usage.input'), value: current.uncached },
    { label: t('usage.output'), value: current.output },
    { label: t('usage.cacheRead'), value: current.cacheRead },
    { label: t('usage.cacheWrite'), value: current.cacheWrite },
  ]

  return (
    <div>
      <BalanceCard balance={balance} t={t} />

      <section style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h4 style={{ ...cardTitleStyle, margin: 0 }}>{t('usage.title')}</h4>
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={tabStyle(tab === 'all')} onClick={() => setTab('all')}>{t('usage.all')}</button>
            <button style={tabStyle(tab === 'today')} onClick={() => setTab('today')}>{t('usage.today')}</button>
          </div>
        </div>
        {current.count === 0 ? (
          <div style={rowStyle}>{t('usage.empty')}</div>
        ) : (
          <>
            {usageRows.map((row) => (
              <div key={row.label} style={rowStyle}>
                <span>{row.label}</span>
                <span style={{ fontWeight: 500 }}>{fmtTokens(row.value)}</span>
              </div>
            ))}
            <div style={{ ...rowStyle, borderTop: '1px solid var(--line-color, rgba(127,127,127,.2))', marginTop: 4, paddingTop: 8 }}>
              <span style={{ fontWeight: 600 }}>{t('usage.total')}</span>
              <span style={{ fontWeight: 600 }}>{fmtTokens(current.uncached + current.output + current.cacheRead + current.cacheWrite)}</span>
            </div>
            <div style={mutedStyle}>
              {t('usage.sessions')}：{current.count}
              {tab === 'today' ? `（${t('usage.today')}）` : ''}
            </div>
          </>
        )}
      </section>

      <section style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h4 style={{ ...cardTitleStyle, margin: 0 }}>{t('cost.title')}</h4>
          {cost !== null && (
            <span style={badgeStyle}>¥{cost.toFixed(2)} <span style={{ opacity: 0.85 }}>· {t('cost.badge')}</span></span>
          )}
        </div>
        <div style={rowStyle}>
          <span>{t('cost.model')}</span>
          <select
            style={inputStyle}
            value={config.priceModel}
            onChange={(event) => setConfig({ priceModel: event.target.value as UsageConfig['priceModel'] })}
          >
            <option value="flash">deepseek-v4-flash</option>
            <option value="pro">deepseek-v4-pro</option>
            <option value="custom">{t('cost.custom')}</option>
          </select>
        </div>
        {config.priceModel === 'custom' && (
          <div style={{ ...rowStyle, flexWrap: 'wrap', gap: 8 }}>
            <label style={mutedStyle}>{t('cost.hit')}
              <input
                type="number" min={0} step={0.01} style={{ ...inputStyle, marginLeft: 6 }}
                value={config.custom.hit}
                onChange={(event) => setConfig({ custom: { hit: Number(event.target.value) } })}
              />
            </label>
            <label style={mutedStyle}>{t('cost.miss')}
              <input
                type="number" min={0} step={0.01} style={{ ...inputStyle, marginLeft: 6 }}
                value={config.custom.miss}
                onChange={(event) => setConfig({ custom: { miss: Number(event.target.value) } })}
              />
            </label>
            <label style={mutedStyle}>{t('cost.output')}
              <input
                type="number" min={0} step={0.01} style={{ ...inputStyle, marginLeft: 6 }}
                value={config.custom.output}
                onChange={(event) => setConfig({ custom: { output: Number(event.target.value) } })}
              />
            </label>
          </div>
        )}
        <div style={mutedStyle}>{t('cost.hint')}</div>
      </section>

      <section style={cardStyle}>
        <h4 style={cardTitleStyle}>{t('config.title')}</h4>
        <div style={rowStyle}>
          <span>{t('config.refreshInterval')}</span>
          <select
            style={inputStyle}
            value={config.refreshMinutes}
            onChange={(event) => setConfig({ refreshMinutes: Number(event.target.value) })}
          >
            <option value={1}>1 {t('config.minutes')}</option>
            <option value={5}>5 {t('config.minutes')}</option>
            <option value={10}>10 {t('config.minutes')}</option>
            <option value={30}>30 {t('config.minutes')}</option>
            <option value={60}>60 {t('config.minutes')}</option>
          </select>
        </div>
        <div style={mutedStyle}>{t('config.source')}</div>
      </section>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 插件主体
// ---------------------------------------------------------------------------

/** 需要的客户端服务（cordis inject）。 */
export const inject = ['slots', 'locale']

/**
 * 浏览器插件入口：注册文案、自动刷新定时器与两个 UI 入口。
 * @param ctx - 客户端根上下文
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-usage-monitor: copy')

  // 余额自动刷新：初始立即刷一次，之后按配置间隔轮询；配置变化时重排定时器。
  ctx.effect(() => {
    void refreshBalance()
    let timer = 0
    const arm = (): void => {
      if (timer !== 0) window.clearInterval(timer)
      timer = window.setInterval(() => { void refreshBalance() }, getConfig().refreshMinutes * 60_000)
    }
    arm()
    const unsubscribe = subscribeConfig(arm)
    return () => {
      window.clearInterval(timer)
      unsubscribe()
    }
  }, 'dsh-usage-monitor: balance auto-refresh')

  const t = ctx.locale.bind(NS)

  ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register({
    name: 'conversation.session.header.utilities',
    id: 'usage-monitor-chip',
    order: 100,
    locale: NS,
  }, UsageChip))

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'usage-monitor',
    order: 40,
    label: () => t('nav'),
    locale: NS,
  }, UsageMonitorSection))
}
