import { deleteCookie, getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { verify } from 'hono/jwt'
import { ObjectId } from 'mongodb'
import type { AuthJWTPayload } from '../modules/user/user.service'
import { users } from './db'
import { ENV } from './dotenv'

export const jwtWare = createMiddleware(async (c, next) => {
  const token = getCookie(c, 'token')
  if (!token) throw new Error('Missing token', { cause: 'jwt' })
  try {
    const decoded = (await verify(token, ENV.JWT_SECRET)) as AuthJWTPayload
    const exists = await users.findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { _id: 1 } },
    )
    if (exists) c.set('userId', decoded.userId)
    else {
      deleteCookie(c, 'token')
      throw new Error('User not found', { cause: 'jwt' })
    }
    return next()
  } catch {
    deleteCookie(c, 'token')
    throw new Error('Invalid token', { cause: 'jwt' })
  }
})
