import { build } from 'esbuild'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const banner = [
  'window.__ModuleLoader__.load({',
  '\tid: "dsh-custom-rules",',
  '\tfactory: (require) => {',
  '\t\tvar module = { exports: {} };',
  '\t\tvar exports = module.exports;',
  '\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: "Module" });',
  '',
].join('\n')
const footer = ['', '\t\treturn module.exports;', '\t}', '});', ''].join('\n')

await build({
  entryPoints: [join(root, 'src/client.tsx')], bundle: true, format: 'cjs', platform: 'browser',
  jsx: 'automatic', target: ['es2020'], external: ['react', 'react/jsx-runtime'],
  outfile: join(root, 'lib/.client-body.js'), logLevel: 'info',
})

writeFileSync(join(root, 'lib/client.js'), banner + readFileSync(join(root, 'lib/.client-body.js'), 'utf8') + footer)
