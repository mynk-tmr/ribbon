import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { ENV } from './utils/dotenv'
import { query } from './utils/query'

const app = new Hono().basePath('/api')

if (!ENV.VERCEL) {
  app.use(cors({ origin: 'http://localhost:3001', credentials: true }))
  app.use(logger())
  console.log('Loaded dev middlewares')
}

app.get('tmdb/*', async (c) => {
  const path = c.req.url.split('/tmdb/').at(-1)
  if (!path) return c.text('Path not found', 401)
  const res = await query<unknown>(path)
  return c.json(res)
})

app.get('auth/validateToken', async (c) => {
  return c.json(null)
})

export default app
