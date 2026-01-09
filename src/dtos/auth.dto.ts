// Auth DTOs for frontend

export interface AuthUser {
  uid: string
  email: string
  createdAt: string
}

export type AuthState = { loading: boolean; user: AuthUser | null }

export interface RegisterInput {
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}
