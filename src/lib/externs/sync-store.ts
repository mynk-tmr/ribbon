import { useSyncExternalStore } from 'react'

export class Store<T> {
  state: T
  subs = new Set<() => void>()
  constructor(state: T) {
    this.state = state
    this.subscribe = this.subscribe.bind(this)
  }
  subscribe(cb: () => void) {
    this.subs.add(cb)
    return () => this.subs.delete(cb)
  }
  get snapshot() {
    return this.state
  }
  emit() {
    this.subs.forEach((cb) => cb())
  }
}

export function useStore<T, R>(store: Store<T>, selector: (state: T) => R) {
  return useSyncExternalStore(store.subscribe, () => selector(store.snapshot))
}
