import { useStore } from '@nanostores/react'
import { authStore } from '@/application/stores/auth.store'
import type { AuthState } from '@/dtos/auth.dto'

export function useAuth(): AuthState {
  return useStore(authStore.store)
}
