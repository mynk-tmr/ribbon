import type { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { verifyToken } from '../services/jwt.service'
import { getCollections } from '../services/mongodb.service'

export async function authMiddleware(c: Context, next: Next) {
  const token = c.req.header('cookie')?.match(/jwt=([^;]+)/)?.[1]

  if (!token) {
    throw new HTTPException(401, { message: 'UNAUTHORIZED' })
  }

  try {
    const { users } = getCollections()
    const payload = await verifyToken(token)
    const user = await users.findOne({ email: payload.email })
    if (!user) throw new Error()
    c.set('uid', user._id)
    c.set('email', user.email)
    c.set('user', user)
    await next()
  } catch {
    throw new HTTPException(401, { message: 'UNAUTHORIZED' })
  }
}
