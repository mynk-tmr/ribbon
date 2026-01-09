import { atom } from 'nanostores'
import type { AuthState } from '@/dtos/auth.dto'
import { API } from '../api'

const $auth = atom<AuthState>({ loading: true, user: null })

export const authStore = {
  store: $auth,
  refresh: async () => {
    const user = await API.auth.check()
    $auth.set({ loading: false, user })
  },
  get value() {
    return $auth.get()
  },
}
