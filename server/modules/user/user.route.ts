import { ENV } from '@/server/utils/dotenv'
import { jwtWare } from '@/server/utils/jwt.middleware'
import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
import type { JwtVariables } from 'hono/jwt'
import type { AuthJWTPayload } from './user.service'

export const userApp = new Hono<{
  Variables: JwtVariables<AuthJWTPayload>
}>()

userApp.use('/me/*', jwtWare)

userApp.post('/register', async (c) => {
  const { UserService } = await import('./user.service')
  const input = await c.res.json()
  await UserService.register(input)
  return c.json({ success: true })
})

userApp.post('/login', async (c) => {
  const { UserService } = await import('./user.service')
  const input = await c.res.json()
  const { user, token, TIME } = await UserService.login(input)
  setCookie(c, 'token', token, {
    httpOnly: true,
    secure: ENV.VERCEL,
    sameSite: ENV.VERCEL ? 'strict' : 'lax',
    maxAge: TIME * 1000,
    path: '/',
  })
  return c.json({ user, token })
})

userApp.put('/me/update', async (c) => {
  const { UserService } = await import('./user.service')
  const input = await c.res.json()
  const { userId } = c.get('jwtPayload')
  await UserService.update(input, userId)
  return c.json({ success: true })
})

userApp.get('/me/validate', async (c) => {
  const { userId } = c.get('jwtPayload')
  return c.json({ userId })
})
