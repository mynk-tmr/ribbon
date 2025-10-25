import type { FirebaseError } from 'firebase/app'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { useSyncExternalStore } from 'react'
import { auth } from '@/config/firebase'

type AuthState = { loading: boolean; user: User | null; error: FirebaseError | null }

class AuthStore {
  state: AuthState = { loading: true, user: null, error: null }
  subs = new Set<() => void>()

  //for outside react
  resolve: undefined | ((t: true) => void)
  ready = new Promise<true>((r) => {
    this.resolve = r
  })

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.setState({ loading: false, user, error: null })
      this.resolve?.(true)
      this.resolve = undefined
    })
  }
  setState(state: AuthState) {
    if (state !== this.state) this.state = state
    for (const c of this.subs) c()
  }
  subscribe(cb: () => void) {
    this.subs.add(cb)
    return () => this.subs.delete(cb)
  }
  async refresh() {
    await this.state.user?.reload()
    this.setState({ ...this.state })
  }
}

export const authStore = new AuthStore()

export function useFireAuthStore() {
  return useSyncExternalStore(
    (cb) => authStore.subscribe(cb),
    () => authStore.state,
  )
}

export function useFireAuthSlice<R>(cb: (state: AuthState) => R) {
  return useSyncExternalStore(
    (cb) => authStore.subscribe(cb),
    () => cb(authStore.state),
  )
}

export function withRefresh<A extends unknown[], R>(
  fn: (...args: A) => Promise<R>,
): typeof fn {
  return async (...args) => {
    const res = await fn(...args)
    await authStore.refresh()
    return res
  }
}
