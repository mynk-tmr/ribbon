import type { AuthUser, LoginInput, RegisterInput } from '@/dtos/auth.dto'
import { authStore } from '../stores/auth.store'
import { api } from './+api-config'

export const AuthAPI = {
  async register(body: RegisterInput): Promise<AuthUser> {
    const result = await api<AuthUser>('/auth/register', {
      method: 'POST',
      body,
    })
    await authStore.refresh()
    return result
  },

  async login(body: LoginInput): Promise<AuthUser> {
    const result = await api<AuthUser>('/auth/login', { method: 'POST', body })
    await authStore.refresh()
    return result
  },

  async logout(): Promise<{ success: boolean }> {
    const result = await api<{ success: boolean }>('/auth/logout', {
      method: 'POST',
    })
    await authStore.refresh()
    return result
  },

  async me(): Promise<AuthUser> {
    return api<AuthUser>('/auth/me')
  },

  async check(): Promise<AuthUser | null> {
    try {
      return await this.me()
    } catch {
      // Silently fail for check() to allow guest states
      return null
    }
  },
}
