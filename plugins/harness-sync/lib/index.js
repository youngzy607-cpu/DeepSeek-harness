import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { spawn } from 'node:child_process'

const PREFIX = '/harness-sync'
const sourceRoot = '/Users/jy/Documents/DeepSeek harness'
const profileRoot = '/Users/jy/.dsh/profiles/web'
const repoRoot = '/Users/jy/Documents/Codex/DeepSeek-harness-sync-repo'
const pluginNames = ['plugin-manager', 'usage-monitor', 'harness-sync']
const withoutDependencies = path => !path.split('/').includes('node_modules')

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(body))
}

function run(command, args, cwd = repoRoot) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] })
    let out = ''
    let err = ''
    child.stdout.on('data', c => { out += c })
    child.stderr.on('data', c => { err += c })
    child.once('error', reject)
    child.once('close', code => code === 0 ? resolve({ out, err }) : reject(new Error(err || `${command} exited ${code}`)))
  })
}

async function snapshot() {
  await mkdir(join(repoRoot, 'plugins'), { recursive: true })
  await mkdir(join(repoRoot, 'profile'), { recursive: true })
  for (const name of pluginNames) {
    await cp(join(sourceRoot, name), join(repoRoot, 'plugins', name), { recursive: true, force: true, filter: withoutDependencies })
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
    await cp(join(repoRoot, 'plugins', name), join(sourceRoot, name), { recursive: true, force: true, filter: withoutDependencies })
  }
  await cp(join(repoRoot, 'profile', 'cordis.patch.yml'), join(profileRoot, 'cordis.patch.yml'), { force: true })
  await run('pnpm', ['install', '--no-frozen-lockfile'], profileRoot)
  return backup
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
        if (req.method === 'POST' && path === `${PREFIX}/backup`) {
          await snapshot(); await run('git', ['add', 'SYNC-MANIFEST.json', 'profile', 'plugins'])
          const status = await run('git', ['status', '--short'])
          if (status.out.trim()) await run('git', ['commit', '-m', `harness sync ${new Date().toISOString()}`])
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
