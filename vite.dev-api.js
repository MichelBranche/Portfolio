import { loadEnv } from 'vite'

const API_ROUTES = {
  '/api/track': () => import('./api/track.js'),
  '/api/admin/login': () => import('./api/admin/login.js'),
  '/api/admin/logout': () => import('./api/admin/logout.js'),
  '/api/admin/stats': () => import('./api/admin/stats.js'),
  '/api/admin/session': () => import('./api/admin/session.js'),
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => {
      if (!data) {
        resolve(undefined)
        return
      }
      try {
        resolve(JSON.parse(data))
      } catch {
        resolve(data)
      }
    })
    req.on('error', reject)
  })
}

export function devApiPlugin() {
  return {
    name: 'portfolio-dev-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      Object.assign(process.env, env)

      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split('?')[0]
        const loader = API_ROUTES[pathname]
        if (!loader) return next()

        try {
          if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            req.body = await readRequestBody(req)
          }
          const mod = await loader()
          await mod.default(req, res)
        } catch (err) {
          console.error('[dev-api]', pathname, err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Dev API error' }))
        }
      })
    },
  }
}
