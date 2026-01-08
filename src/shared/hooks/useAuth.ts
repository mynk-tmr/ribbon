import { useStore } from '@nanostores/react'
import { authStore, authStoreActions } from '@/application/stores/auth.store'
import type { AuthState } from '@/domain/entities'

export function useAuth(): AuthState {
  return useStore(authStore)
}

export { authStoreActions }
