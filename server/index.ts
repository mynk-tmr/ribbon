import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { errorhandler } from './modules/error.handler'
import { tmdbApp } from './modules/tmdb.route'
import { ENV } from './utils/dotenv'

const app = new Hono().basePath('/api')

if (!ENV.VERCEL) {
  app.use(cors({ origin: 'http://localhost:3001', credentials: true }))
  app.use(logger())
  console.log('Loaded dev middlewares')
}
app.onError(errorhandler)
app.route('/tmdb', tmdbApp)

export default app
