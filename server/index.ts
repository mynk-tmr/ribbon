import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { tmdbApp } from './modules/tmdb.routes'
import { userApp } from './modules/user/user.route'
import { ENV } from './utils/dotenv'

const app = new Hono().basePath('/api')

if (!ENV.VERCEL) {
  app.use(cors({ origin: 'http://localhost:3001', credentials: true }))
  app.use(logger())
  console.log('Loaded dev middlewares')
}

app.route('/tmdb', tmdbApp)
app.route('/users', userApp)

export default app
