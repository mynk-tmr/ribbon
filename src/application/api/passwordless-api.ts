import type { AuthUser } from '@/dtos/auth.dto'
import { authStore } from '../stores/auth.store'
import { api } from './+api-config'

export const PasswordlessAPI = {
  async sendLoginLink(email: string): Promise<{ success: boolean }> {
    return api('/passwordless/send-login', { method: 'POST', body: { email } })
  },

  async sendPasswordReset(email: string): Promise<{ success: boolean }> {
    return api('/passwordless/send-reset', { method: 'POST', body: { email } })
  },

  async verifyToken(token: string): Promise<AuthUser> {
    const result = await api<AuthUser>('/passwordless/verify', {
      method: 'POST',
      body: { token },
    })

    await authStore.refresh()
    return result
  },
}
