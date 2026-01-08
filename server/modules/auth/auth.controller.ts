import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { connect } from '../../services/mongodb.service'
import { loginInputSchema, registerInputSchema } from './auth.dto'
import { AuthError, generateUserToken, login, register } from './auth.service'

export async function registerController(c: Context) {
  await connect()

  const body = await c.req.json()
  const input = registerInputSchema.assert(body)

  try {
    const user = await register(input)
    return c.json({ uid: user.uid, email: user.email }, 201)
  } catch (error) {
    if (error instanceof AuthError) {
      throw new HTTPException(400, { message: error.code })
    }
    throw error
  }
}

export async function loginController(c: Context) {
  await connect()

  const body = await c.req.json()
  const input = loginInputSchema.assert(body)

  try {
    const user = await login(input)
    const token = await generateUserToken(user.uid, user.email)

    c.header(
      'Set-Cookie',
      `jwt=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
    )
    return c.json({ uid: user.uid, email: user.email })
  } catch (error) {
    if (error instanceof AuthError) {
      throw new HTTPException(401, { message: error.code })
    }
    throw error
  }
}

export async function logoutController(c: Context) {
  c.header('Set-Cookie', 'jwt=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0')
  return c.json({ success: true })
}

export async function meController(c: Context) {
  const uid = c.get('uid')
  const email = c.get('userEmail')

  return c.json({ uid, email })
}
