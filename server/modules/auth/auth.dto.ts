import { type } from 'arktype'

// Input validation schemas
export const registerInputSchema = type({
  email: 'string.email',
  password: 'string >= 8',
})

export const loginInputSchema = type({
  email: 'string.email',
  password: 'string > 0',
})

// Types
export type RegisterInput = typeof registerInputSchema.infer
export type LoginInput = typeof loginInputSchema.infer

export interface AuthUser {
  uid: string
  email: string
}
