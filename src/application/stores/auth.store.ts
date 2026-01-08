import { atom } from 'nanostores'
import type { AuthState } from '@/dtos/auth.dto'
import { AuthAPI } from './api-store'

export const authStore = atom<AuthState>({ loading: true, user: null })

export const authStoreActions = {
  refresh: async () => {
    const user = await AuthAPI.check()
    authStore.set({ loading: false, user })
  },
}
