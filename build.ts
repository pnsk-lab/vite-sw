import fs from 'node:fs/promises'
import { build } from 'esbuild'

await build({
  entryPoints: ['./lib/index.ts'],
  outfile: 'dist/index.js',
})
await fs.copyFile('lib/index.d.ts', 'dist/index.d.ts')
await fs.copyFile('lib/types.d.ts', 'dist/types.d.ts')
