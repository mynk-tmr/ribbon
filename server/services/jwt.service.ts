import { sign, verify } from 'hono/jwt'
import type { ObjectId } from 'mongodb'
import { ENV } from '../utils/dotenv'

export interface JWTPayload {
  uid: string
  email: string
  exp: number
  [key: string]: unknown
}

export async function generateToken(
  uid: ObjectId,
  email: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const payload = { uid: uid.toString(), email, exp: now + ENV.JWT_EXPIRES_IN }

  return await sign(payload, ENV.JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const decoded = await verify(token, ENV.JWT_SECRET)
  return {
    uid: String(decoded.uid),
    email: String(decoded.email),
    exp: Number(decoded.exp),
  }
}
