import { onAuthStateChanged } from 'firebase/auth'
import { useSyncExternalStore } from 'react'
import { auth } from './init'

let tick = 1
let loading = true
const subs = new Set<() => void>()

function getTick() {
  return tick
}

function subscribe(cb: () => void) {
  subs.add(cb)
  return () => subs.delete(cb)
}

async function refresh() {
  tick *= -1
  loading = false
  await auth.currentUser?.reload()
  subs.forEach((cb) => cb())
}

onAuthStateChanged(auth, refresh)

export function useFireAuth() {
  const _tick = useSyncExternalStore(subscribe, getTick)
  return {
    refresh,
    loading,
    get USER() {
      if (!auth.currentUser)
        throw new Error('USER getter must be used when signed in')
      return auth.currentUser
    },
    user: auth.currentUser,
  }
}
