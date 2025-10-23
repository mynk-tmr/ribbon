import { onAuthStateChanged } from 'firebase/auth'
import { Store, useStore } from '../externs/sync-store'
import { auth } from './init'

class FireAuthStore extends Store<number> {
  loading = true
  async refresh() {
    this.loading = false
    this.state *= -1 //triggers re-render
    await auth.currentUser?.reload()
    this.emit()
  }
  get USER() {
    if (!auth.currentUser)
      throw new Error('USER getter must be used when signed in')
    return auth.currentUser
  }
  get user() {
    return auth.currentUser
  }
}

const fireauthstore = new FireAuthStore(-1)

onAuthStateChanged(auth, () => fireauthstore.refresh())

export function useFireAuth() {
  useStore(fireauthstore, (t) => t)
  return fireauthstore
}
