import { onAuthStateChanged } from 'firebase/auth'
import { type DBSchema, type IDBPDatabase, openDB } from 'idb'
import { useState, useSyncExternalStore } from 'react'
import { authStore } from '@/hooks/useFireAuth'
import { auth } from './firebase'

export type MediaItem = {
  id: number
  parentLink?: string
  parentTitle?: string
  title: string
  poster_path: string | null
  favourite: boolean
  status: 'completed' | 'watching' | 'planned'
  link: string
  addedAt: Date
  updatedAt: Date
  media_type: 'movie' | 'tv' | 'episode'
}

export type SearchItem = {
  id: string
  query: string
  entity: 'movie' | 'tv' | 'person'
  addedAt: Date
}

interface MyDB extends DBSchema {
  media: { key: number; value: MediaItem }
  search: { key: string; value: SearchItem }
}

let db: IDBPDatabase<MyDB> | undefined

async function init() {
  const uid = authStore.state.user?.uid || 'guest'
  const dbName = `appdb-${uid}`
  db = await openDB<MyDB>(dbName, 1, {
    upgrade(db) {
      db.createObjectStore('media', { keyPath: 'id' })
      db.createObjectStore('search', { keyPath: 'id' })
    },
  })
  console.log(`IDB opened: ${dbName}`)
  await $myMedias.refresh()
  await $searches.refresh()
}

async function getDB() {
  if (!db) await init()
  return db!
}

onAuthStateChanged(auth, () => {
  db?.close()
  init()
})

class Store {
  subs = new Set<() => void>()
  subscribe(cb: () => void) {
    this.subs.add(cb)
    return () => this.subs.delete(cb)
  }
  emit() {
    for (const cb of this.subs) cb()
  }
}

class Searches extends Store {
  state: SearchItem[] = []
  async refresh() {
    const db = await getDB()
    this.state = await db.getAll('search')
    this.emit()
  }
  async add(item: Omit<SearchItem, 'addedAt' | 'id'>) {
    const db = await getDB()
    const id = `${item.entity}-${item.query}`
    if (await db.get('search', id)) return
    await db.add('search', { ...item, id, addedAt: new Date() })
    await this.refresh()
  }
  async drop(id: string) {
    const db = await getDB()
    await db.delete('search', id)
    await this.refresh()
  }
  async clear() {
    const db = await getDB()
    await db.clear('search')
    await this.refresh()
  }
}

class MyMedias extends Store {
  state: MediaItem[] = []
  async refresh() {
    const db = await getDB()
    this.state = await db.getAll('media')
    this.emit()
  }
  async add(item: Omit<MediaItem, 'addedAt' | 'updatedAt'>) {
    const db = await getDB()
    const now = new Date()
    await db.add('media', { ...item, addedAt: now, updatedAt: now })
    await this.refresh()
  }
  async put(id: MediaItem['id'], item: Partial<MediaItem>) {
    const db = await getDB()
    const prev = await db.get('media', id)
    if (!prev) throw new Error('IDB::MyMedias -> Media not found')
    const neo = { ...prev, ...item, updatedAt: new Date(), id: prev.id }
    await db.put('media', neo)
    await this.refresh()
  }
  async drop(id: MediaItem['id']) {
    const db = await getDB()
    await db.delete('media', id)
    await this.refresh()
  }
  async clear() {
    const db = await getDB()
    await db.clear('media')
    await this.refresh()
  }
}

export const $searches = new Searches()
export const $myMedias = new MyMedias()

export function useIDBStore<R, T extends MyMedias | Searches>(
  store: T,
  selector: (st: T['state']) => R,
  eqFn: (old: R, neo: R) => boolean = (a, b) => Object.is(a, b),
) {
  const [snap, setSnap] = useState(() => selector(store.state))
  return useSyncExternalStore(
    (c) => store.subscribe(c),
    () => {
      const newSnap = selector(store.state)
      if (eqFn?.(snap, newSnap)) return snap
      setSnap(newSnap)
      return newSnap
    },
  )
}
