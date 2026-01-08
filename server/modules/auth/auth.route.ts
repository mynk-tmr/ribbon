import { Hono } from 'hono'
import { authMiddleware } from '../../middleware/auth.middleware'
import {
  loginController,
  logoutController,
  meController,
  registerController,
} from './auth.controller'

const authApp = new Hono()

authApp.post('/register', registerController)
authApp.post('/login', loginController)
authApp.post('/logout', logoutController)
authApp.get('/me', authMiddleware, meController)

export { authApp }
