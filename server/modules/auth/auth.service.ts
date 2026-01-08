import { ObjectId } from 'mongodb'
import { generateToken } from '../../services/jwt.service'
import { getCollections } from '../../services/mongodb.service'
import type { AuthUser, LoginInput, RegisterInput } from './auth.dto'

export class AuthError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

export async function register(input: RegisterInput): Promise<AuthUser> {
  const { users } = getCollections()

  // Check if email already exists
  const existingUser = await users.findOne({ email: input.email })
  if (existingUser) {
    throw new AuthError('EMAIL_EXISTS', 'Email already registered')
  }

  // Hash password
  const passwordHash = await Bun.password.hash(input.password)

  // Create user
  const result = await users.insertOne({
    email: input.email,
    passwordHash,
    createdAt: new Date(),
    lastLogin: new Date(),
  })

  return { uid: result.insertedId.toString(), email: input.email }
}

export async function login(input: LoginInput): Promise<AuthUser> {
  const { users } = getCollections()

  const user = await users.findOne({ email: input.email })
  if (!user) {
    throw new AuthError('INVALID_CREDENTIALS', 'Invalid email or password')
  }

  const isValid = await Bun.password.verify(input.password, user.passwordHash)
  if (!isValid) {
    throw new AuthError('INVALID_CREDENTIALS', 'Invalid email or password')
  }

  // Update last login
  await users.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } })

  return { uid: user._id.toString(), email: user.email }
}

export async function generateUserToken(
  uid: string,
  email: string,
): Promise<string> {
  const objectId = new ObjectId(uid)
  return await generateToken(objectId, email)
}
