import type { Plugin, ViteDevServer } from 'vite'
import path from 'node:path'

export const pluginSW = (): Plugin => {
  let config: ViteDevServer['config']
  return {
    name: 'vite-plugin-sw',
    configureServer (server) {
      config = server.config
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.originalUrl ?? '/', 'http://localhost')
        if (!url.pathname.startsWith('/sw--') || !url.pathname.endsWith('.js')) {
          return next()
        }
        const name = decodeURIComponent(url.pathname.replace(/\/sw--/, '').replaceAll('_2F', '%2F')).replace(/\.js$/, '')
        
        const code = `import init from '/${name.replaceAll('\'', '\\\'')}?t=${Date.now()}';\ninit(self);`
        res.setHeader('Content-Type', 'application/javascript')
        res.end(code)
      })
    },
    load(id, options) {
      if (id.endsWith('?sw')) {
        const swPath = path.relative(config.root, id.replace(/\?sw$/, ''))
        const swUrl = `/sw--${encodeURIComponent(swPath).replaceAll('%2F', '_2F')}.js`
        return {
          code: `export default (opts) => {
            console.log('${swUrl}')
            return navigator.serviceWorker.register('${swUrl}', {
              ...opts,
              type: "module"
            })
          }`
        }
      }
    },
  }
}
