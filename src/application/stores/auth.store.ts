import { onAuthStateChanged, type User } from 'firebase/auth'
import { atom } from 'nanostores'
import type { AuthState, AuthUser } from '@/domain/entities'
import { firebaseAuth } from '../api/firebase/firebase.client'

function toAuthUser(user: User | null): AuthUser | null {
  if (!user) return null
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  }
}

export const authStore = atom<AuthState>({ loading: true, user: null })

onAuthStateChanged(firebaseAuth, (user) => {
  authStore.set({ loading: false, user: toAuthUser(user) })
})

export const authStoreActions = {
  refresh: async () => {
    await firebaseAuth.currentUser?.reload()
    authStore.set({
      loading: false,
      user: toAuthUser(firebaseAuth.currentUser),
    })
  },

  // Get the raw Firebase User for operations that need it
  getFirebaseUser: (): User | null => {
    return firebaseAuth.currentUser
  },
}
