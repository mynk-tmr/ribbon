import { useStore } from '@nanostores/react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { atom } from 'nanostores'
import { auth } from '@/config/firebase'

type AuthState = { loading: boolean; user: User | null }

export const authStore = atom<AuthState>({ loading: true, user: null })

onAuthStateChanged(auth, (user) => {
  authStore.set({ loading: false, user })
})

export function useFireAuthStore() {
  return useStore(authStore)
}

export const authStoreActions = {
  refresh: () => authStore.set({ loading: true, user: auth.currentUser }),
}
