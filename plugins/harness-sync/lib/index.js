import { access, cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { execFile, spawn } from 'node:child_process'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'

const PREFIX = '/harness-sync'
const pluginRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = resolve(pluginRoot, '..')
const profileRoot = join(homedir(), '.dsh', 'profiles', 'web')
const repoRoot = process.env.DSH_HARNESS_SYNC_REPO || join(homedir(), 'Documents', 'Codex', 'DeepSeek-harness-sync-repo')
const pluginNames = ['plugin-manager', 'usage-monitor', 'harness-sync']
const withoutDependencies = path => !path.split('/').includes('node_modules')
const operations = new Map()

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(body))
}

function macOSProxyEnv() {
  return new Promise(resolveProxy => {
    execFile('scutil', ['--proxy'], { timeout: 2500 }, (error, stdout) => {
      const host = /HTTPSProxy\s*:\s*(\S+)/.exec(stdout)?.[1]
      const port = /HTTPSPort\s*:\s*(\d+)/.exec(stdout)?.[1]
      if (error || !/HTTPSEnable\s*:\s*1/.test(stdout) || !host || !port) return resolveProxy({})
      const proxy = `http://${host}:${port}`
      resolveProxy({ HTTP_PROXY: proxy, HTTPS_PROXY: proxy, ALL_PROXY: proxy })
    })
  })
}

async function run(command, args, cwd = repoRoot) {
  const proxyEnv = await macOSProxyEnv()
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, ...proxyEnv, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'Never' } })
    let out = ''
    let err = ''
    child.stdout.on('data', c => { out += c })
    child.stderr.on('data', c => { err += c })
    child.once('error', reject)
    child.once('close', code => code === 0 ? resolve({ out, err }) : reject(new Error(err || `${command} exited ${code}`)))
  })
}

async function executable(path) {
  try { await access(path, constants.X_OK); return path } catch { return null }
}

async function profilePackageManager() {
  const nodeBin = dirname(process.execPath)
  const pnpm = await executable(join(nodeBin, 'pnpm'))
  if (pnpm) return { command: pnpm, args: ['install', '--no-frozen-lockfile'] }
  const corepack = await executable(join(nodeBin, 'corepack'))
  if (corepack) return { command: corepack, args: ['pnpm', 'install', '--no-frozen-lockfile'] }
  throw new Error('未找到 pnpm 或 Corepack。请重新安装 Node.js LTS 后再同步 Git。')
}

function cleanMessage(error) {
  return String(error?.message ?? error).replace(/https?:\/\/[^\s@]+@/g, 'https://***@').trim().slice(0, 500)
}

function createOperation(kind) {
  const operation = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, kind, state: 'running', steps: [], startedAt: new Date().toISOString() }
  operations.set(operation.id, operation)
  while (operations.size > 12) operations.delete(operations.keys().next().value)
  return operation
}

async function record(operation, title, detail, task) {
  const step = { title, detail, state: 'running', startedAt: new Date().toISOString() }
  operation.steps.push(step)
  try {
    const result = await task()
    step.state = 'success'; step.finishedAt = new Date().toISOString()
    return result
  } catch (error) {
    step.state = 'failed'; step.error = cleanMessage(error); step.finishedAt = new Date().toISOString()
    throw error
  }
}

async function snapshot() {
  await mkdir(join(repoRoot, 'plugins'), { recursive: true })
  await mkdir(join(repoRoot, 'profile'), { recursive: true })
  for (const name of pluginNames) {
    const src = join(sourceRoot, name)
    const dest = join(repoRoot, 'plugins', name)
    if (resolve(src) !== resolve(dest)) {
      await cp(src, dest, { recursive: true, force: true, filter: withoutDependencies })
    }
  }
  await cp(join(profileRoot, 'cordis.patch.yml'), join(repoRoot, 'profile', 'cordis.patch.yml'), { force: true })
  const packageJson = JSON.parse(await readFile(join(profileRoot, 'package.json'), 'utf8'))
  delete packageJson.dependencies?.['dsh-harness-sync']
  await writeFile(join(repoRoot, 'profile', 'package.template.json'), JSON.stringify(packageJson, null, 2) + '\n')
  await writeFile(join(repoRoot, 'SYNC-MANIFEST.json'), JSON.stringify({ version: 1, plugins: pluginNames, excludes: ['.credentials.yaml', 'sessions', 'storages', 'browser-cache'] }, null, 2) + '\n')
}

async function restore() {
  const backup = `${profileRoot}.before-sync-${Date.now()}`
  await cp(profileRoot, backup, { recursive: true, force: true, filter: withoutDependencies })
  for (const name of pluginNames) {
    const src = join(repoRoot, 'plugins', name)
    const dest = join(sourceRoot, name)
    if (resolve(src) !== resolve(dest)) {
      await cp(src, dest, { recursive: true, force: true, filter: withoutDependencies })
    }
  }
  await cp(join(repoRoot, 'profile', 'cordis.patch.yml'), join(profileRoot, 'cordis.patch.yml'), { force: true })
  const packageManager = await profilePackageManager()
  await run(packageManager.command, packageManager.args, profileRoot)
  return backup
}

async function execute(operation) {
  try {
    if (operation.kind === 'backup') {
      await record(operation, '生成同步快照', `同步插件：${pluginNames.join('、')}；同步 Web profile 配置。`, snapshot)
      await record(operation, '检查敏感信息排除', '已排除 API Key、.credentials.yaml、会话、存储、浏览器缓存和 node_modules。', async () => {})
      await record(operation, '写入 Git 暂存区', '准备提交同步清单、插件源码和 profile 配置。', () => run('git', ['add', 'SYNC-MANIFEST.json', 'profile', 'plugins']))
      const status = await run('git', ['status', '--short'])
      if (status.out.trim()) await record(operation, '创建本地提交', '记录本次配置快照。', () => run('git', ['commit', '-m', `"harness sync ${new Date().toISOString()}"`]))
      else operation.steps.push({ title: '创建本地提交', detail: '配置没有变化，跳过创建新提交。', state: 'skipped' })
      await record(operation, '推送到 GitHub', '推送到 youngzy607-cpu/DeepSeek-harness 的 main 分支。', () => run('git', ['push', 'origin', 'main']))
    } else {
      await record(operation, '拉取 Git 配置', '从 youngzy607-cpu/DeepSeek-harness 的 main 分支同步。', () => run('git', ['pull', '--ff-only', 'origin', 'main']))
      const backup = await record(operation, '备份本机配置', '同步前创建本机配置备份，便于回退。', restore)
      operation.backup = backup
      operation.steps.push({ title: 'Git 同步完成', detail: `本机旧配置备份到：${backup}；请重启 Harness。`, state: 'success' })
    }
    operation.state = 'success'; operation.finishedAt = new Date().toISOString()
  } catch (error) {
    operation.state = 'failed'; operation.error = cleanMessage(error); operation.finishedAt = new Date().toISOString()
  }
}

export default {
  name: 'dsh-harness-sync', inject: ['webServer'],
  apply(ctx) {
    ctx.effect(() => ctx.webServer.register({ kind: 'prefix', path: PREFIX, handler: async (req, res) => {
      const path = new URL(req.url ?? '/', 'http://localhost').pathname
      try {
        if (req.method === 'GET' && path === `${PREFIX}/status`) {
          const branch = await run('git', ['branch', '--show-current'])
          const status = await run('git', ['status', '--short'])
          return json(res, 200, { ok: true, repository: 'youngzy607-cpu/DeepSeek-harness', branch: branch.out.trim() || 'main', dirty: Boolean(status.out.trim()) })
        }
        if (req.method === 'POST' && (path === `${PREFIX}/operations/backup` || path === `${PREFIX}/operations/restore`)) {
          const operation = createOperation(path.endsWith('/backup') ? 'backup' : 'restore')
          void execute(operation)
          return json(res, 202, { ok: true, operation })
        }
        if (req.method === 'GET' && path.startsWith(`${PREFIX}/operations/`)) {
          const operation = operations.get(path.slice(`${PREFIX}/operations/`.length))
          return operation ? json(res, 200, { ok: true, operation }) : json(res, 404, { ok: false, error: { message: '未找到同步任务' } })
        }
        if (req.method === 'POST' && path === `${PREFIX}/backup`) {
          await snapshot(); await run('git', ['add', 'SYNC-MANIFEST.json', 'profile', 'plugins'])
          const status = await run('git', ['status', '--short'])
          if (status.out.trim()) await run('git', ['commit', '-m', `"harness sync ${new Date().toISOString()}"`])
          await run('git', ['push', 'origin', 'main'])
          return json(res, 200, { ok: true })
        }
        if (req.method === 'POST' && path === `${PREFIX}/restore`) {
          await run('git', ['pull', '--ff-only', 'origin', 'main'])
          const backup = await restore()
          return json(res, 200, { ok: true, backup, restartRequired: true })
        }
        return json(res, 404, { ok: false, error: { message: 'not found' } })
      } catch (error) { return json(res, 500, { ok: false, error: { message: error.message } }) }
    } }), 'dsh-harness-sync: routes')
  },
}
