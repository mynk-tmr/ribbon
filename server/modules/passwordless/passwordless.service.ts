import { randomBytes } from 'node:crypto'
import { HTTPException } from 'hono/http-exception'
import { connect } from '../../services/mongodb.service'
import { ENV } from '../../utils/dotenv'
import type { AuthUser } from '../auth/auth.dto'

// Generate a secure random token
function generateToken(): string {
  return randomBytes(32).toString('hex')
}

export class PasswordlessService {
  /**
   * Send a magic login link to the user's email
   * Creates a token and stores it in MongoDB
   */
  async sendMagicLink(email: string): Promise<{ success: true }> {
    const db = await connect()
    const magicLinks = db.collection('magic_links')

    // Generate a secure token
    const token = generateToken()
    const expiresAt = new Date(Date.now() + ENV.MAGIC_LINK_EXPIRES_IN * 1000)

    // Store the token in MongoDB
    await magicLinks.insertOne({
      email,
      token,
      type: 'login',
      expiresAt,
      used: false,
      createdAt: new Date(),
    })

    // TODO: Send email with the magic link
    // For now, just log the link (in production, use an email service)
    const magicLink = `${ENV.EMAIL_ACTION_URL}?token=${token}`
    console.log('Magic login link:', magicLink)

    return { success: true }
  }

  /**
   * Send a password reset email to the user
   * Creates a token and stores it in MongoDB
   */
  async sendPasswordResetEmail(email: string): Promise<{ success: true }> {
    const db = await connect()
    const magicLinks = db.collection('magic_links')

    // Generate a secure token
    const token = generateToken()
    const expiresAt = new Date(Date.now() + ENV.MAGIC_LINK_EXPIRES_IN * 1000)

    // Store the token in MongoDB
    await magicLinks.insertOne({
      email,
      token,
      type: 'reset',
      expiresAt,
      used: false,
      createdAt: new Date(),
    })

    // TODO: Send email with the reset link
    // For now, just log the link (in production, use an email service)
    const resetLink = `${ENV.EMAIL_ACTION_URL}?token=${token}&mode=reset`
    console.log('Password reset link:', resetLink)

    return { success: true }
  }

  /**
   * Verify a magic link token
   * Checks the token in MongoDB and returns the user if valid
   */
  async verifyToken(token: string): Promise<AuthUser> {
    const db = await connect()
    const magicLinks = db.collection('magic_links')
    const users = db.collection('users')

    // Find the token
    const magicLink = await magicLinks.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    })

    if (!magicLink) {
      throw new HTTPException(400, { message: 'INVALID_OR_EXPIRED_TOKEN' })
    }

    const email = magicLink.email

    // Mark token as used
    await magicLinks.updateOne(
      { _id: magicLink._id },
      { $set: { used: true, usedAt: new Date() } },
    )

    // Find or create user
    let user = await users.findOne({ email })

    if (!user) {
      const result = await users.insertOne({ email, createdAt: new Date() })
      user = { _id: result.insertedId, email }
    }

    return { uid: user._id.toString(), email: user.email }
  }
}

export const passwordlessService = new PasswordlessService()
