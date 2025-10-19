import {
  failIfAbsent,
  failIfPresent,
  users,
  type UserEntity,
} from '@/server/utils/db'
import { ENV } from '@/server/utils/dotenv'
import { type } from 'arktype'
import { compare, hash } from 'bcryptjs'
import { sign } from 'hono/jwt'
import type { JWTPayload } from 'hono/utils/jwt/types'
import { ObjectId } from 'mongodb'

export const UserService = { register, login, update }

export type AuthJWTPayload = JWTPayload & { userId: string }

const schema = type({
  fullname: 'string.trim & 3 < string < 31',
  email: 'string.email',
  password: '/^\\S{8,30}$/',
  avatar: 'string.url',
  emailVerified: 'boolean=false',
})

async function register(input: unknown) {
  const { password, ...data } = schema.assert(input)
  await failIfPresent(
    users.findOne({ email: data.email, emailVerified: true }),
    'Email already in use',
  )
  const passwordHash = await hash(password, 12)
  await users.insertOne({
    ...data,
    passwordHash,
    emailVerified: false,
    createdAt: new Date(),
  })
}

async function getVerified(data: { email: string; password: string }) {
  const user = await users.findOne({ email: data.email, emailVerified: true })
  if (!user) return null
  const isSame = await compare(data.password, user.passwordHash)
  return isSame ? user : null
}

async function getUnverified(data: { email: string; password: string }) {
  const candidates = users.find({ email: data.email, emailVerified: false })
  for await (const c of candidates) {
    const isSame = await compare(data.password, c.passwordHash)
    if (isSame) return c
  }
}

async function login(input: unknown) {
  const data = schema.pick('email', 'password', 'emailVerified').assert(input)
  const user = await failIfAbsent(
    data.emailVerified ? getVerified(data) : getUnverified(data),
    'Invalid email/password',
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safe } = user

  //generate jwt
  const TIME = 14 * 24 * 60 * 60

  const payload: AuthJWTPayload = {
    userId: user._id.toString(),
    exp: Math.floor(Date.now() / 1000) + TIME,
  }
  const token = await sign(payload, ENV.JWT_SECRET)

  return { user: safe, token, TIME }
}

async function update(input: unknown, userId: string) {
  const { avatar, email, fullname, password } = schema.partial().assert(input)
  const draft = { fullname, avatar } as Partial<UserEntity>
  if (email) {
    await failIfPresent(
      users.findOne({ email, emailVerified: true }),
      'Email already in use',
    )
    draft.email = email
    draft.emailVerified = false
  }
  if (password) {
    draft.passwordHash = await hash(password, 12)
  }
  await users.updateOne({ _id: new ObjectId(userId) }, { $set: draft })
}
