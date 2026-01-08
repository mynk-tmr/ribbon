import type { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { verifyToken } from '../services/jwt.service'

export async function authMiddleware(c: Context, next: Next) {
  const token = c.req.header('cookie')?.match(/jwt=([^;]+)/)?.[1]

  if (!token) {
    throw new HTTPException(401, { message: 'UNAUTHORIZED' })
  }

  try {
    const payload = await verifyToken(token)
    c.set('uid', payload.uid)
    c.set('userEmail', payload.email)
    await next()
  } catch {
    throw new HTTPException(401, { message: 'UNAUTHORIZED' })
  }
}
