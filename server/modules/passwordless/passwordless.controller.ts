import { type } from 'arktype'
import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { generateToken } from '../../services/jwt.service'
import { connect } from '../../services/mongodb.service'
import { ENV } from '../../utils/dotenv'
import {
  SendMagicLinkInput,
  SendPasswordResetInput,
  VerifyTokenInput,
} from './passwordless.dto'
import { passwordlessService } from './passwordless.service'

const app = new Hono()

/**
 * POST /passwordless/send-login
 * Send a magic login link to the user's email
 */
app.post(
  '/send-login',
  validator('json', (value, c) => {
    const parsed = SendMagicLinkInput(value)
    if (parsed instanceof type.errors) {
      return c.json(
        { error: { code: 'VALIDATION_ERROR', message: parsed.summary } },
        400,
      )
    }
    return parsed as { email: string }
  }),
  async (c) => {
    const { email } = c.req.valid('json')
    await passwordlessService.sendMagicLink(email)
    return c.json({ success: true })
  },
)

/**
 * POST /passwordless/send-reset
 * Send a password reset email
 */
app.post(
  '/send-reset',
  validator('json', (value, c) => {
    const parsed = SendPasswordResetInput(value)
    if (parsed instanceof type.errors) {
      return c.json(
        { error: { code: 'VALIDATION_ERROR', message: parsed.summary } },
        400,
      )
    }
    return parsed as { email: string }
  }),
  async (c) => {
    const { email } = c.req.valid('json')
    await passwordlessService.sendPasswordResetEmail(email)
    return c.json({ success: true })
  },
)

/**
 * POST /passwordless/verify
 * Verify a magic link token and set JWT cookie
 */
app.post(
  '/verify',
  validator('json', (value, c) => {
    const parsed = VerifyTokenInput(value)
    if (parsed instanceof type.errors) {
      return c.json(
        { error: { code: 'VALIDATION_ERROR', message: parsed.summary } },
        400,
      )
    }
    return parsed as { token: string }
  }),
  async (c) => {
    const { token } = c.req.valid('json')

    // Verify the magic link token
    const user = await passwordlessService.verifyToken(token)

    // Get user from database (already created in verifyToken)
    const db = await connect()
    const users = db.collection('users')
    const existingUser = await users.findOne({ email: user.email })

    if (!existingUser) {
      throw new Error('User not found after verification')
    }

    // Generate JWT token
    const jwtToken = await generateToken(existingUser._id, existingUser.email)

    // Set JWT cookie
    c.header(
      'Set-Cookie',
      `jwt=${jwtToken}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${ENV.JWT_EXPIRES_IN}`,
    )

    return c.json(user)
  },
)

export default app
