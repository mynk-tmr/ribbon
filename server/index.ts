import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { authApp } from './modules/auth/auth.route'
import { errorhandler } from './modules/error.handler'
import { mediaApp } from './modules/media/media.route'
import passwordlessApp from './modules/passwordless/passwordless.route'
import { searchApp } from './modules/search/search.route'
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
app.route('/auth', authApp)
app.route('/media', mediaApp)
app.route('/search', searchApp)
app.route('/passwordless', passwordlessApp)

export default app
