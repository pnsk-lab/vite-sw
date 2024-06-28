import type { Plugin, ViteDevServer } from 'vite'
import path from 'node:path'
import { build } from 'esbuild'
import fs from 'node:fs/promises'

export const pluginSW = (): Plugin => {
  let config: ViteDevServer['config']
  const swPaths: Map<string, string> = new Map()
  return {
    name: 'vite-plugin-sw',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    async buildEnd() {
      const bundled = await build({
        entryPoints: [...swPaths.keys()],
        write: false,
        minify: true,
        bundle: true,
      })
      if (bundled.errors) {
        throw bundled.errors[0]
      }
      let i = 0
      for (const dist of swPaths.values()) {
        await fs.writeFile(
          path.join(config.build.outDir, dist),
          bundled.outputFiles[i].text,
        )
        i++
      }
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.originalUrl ?? '/', 'http://localhost')
        if (
          !url.pathname.startsWith('/sw--') ||
          !url.pathname.endsWith('.js')
        ) {
          return next()
        }
        const name = decodeURIComponent(
          url.pathname.replace(/\/sw--/, '').replaceAll('_2F', '%2F'),
        ).replace(/\.js$/, '')

        const pathToBundle = path.join(config.root, name)
        const bundled = await build({
          entryPoints: [pathToBundle],
          write: false,
          sourcemap: 'inline',
          bundle: true,
        })
        const code = bundled.outputFiles[0].text
        res.setHeader('Content-Type', 'application/javascript')
        res.end(code)
      })
    },
    load(id) {
      if (id.endsWith('?sw')) {
        const swPath = path.relative(config.root, id.replace(/\?sw$/, ''))
        const swUrl = `/sw--${encodeURIComponent(swPath).replaceAll('%2F', '_2F')}.js`
        swPaths.set(swPath, `.${swUrl}`)
        return {
          code: `export default (opts) => {
            return navigator.serviceWorker.register('${swUrl}', {
              ...opts,
              type: "module"
            })
          }`,
        }
      }
    },
  }
}
