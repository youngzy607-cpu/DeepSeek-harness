/**
 * 构建浏览器端 bundle：src/client.tsx → lib/client.js
 *
 * 输出格式与官方客户端插件一致：一个经典脚本，通过
 * `window.__ModuleLoader__.load({ id, factory })` 注册工厂。
 */
import { build } from 'esbuild'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))

const banner = [
  'window.__ModuleLoader__.load({',
  '\tid: "dsh-plugin-manager",',
  '\tfactory: (require) => {',
  '\t\tvar module = { exports: {} };',
  '\t\tvar exports = module.exports;',
  '\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: "Module" });',
  '',
].join('\n')

const footer = [
  '',
  '\t\treturn module.exports;',
  '\t}',
  '});',
  '',
].join('\n')

await build({
  entryPoints: [join(root, 'src/client.tsx')],
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  jsx: 'automatic',
  target: ['es2020'],
  // 浏览器端由 shell 静态注册，保持 external
  external: ['react', 'react/jsx-runtime'],
  outfile: join(root, 'lib/.client-body.js'),
  logLevel: 'info',
})

const body = readFileSync(join(root, 'lib/.client-body.js'), 'utf8')
writeFileSync(join(root, 'lib/client.js'), banner + body + footer)
console.log('built lib/client.js')
