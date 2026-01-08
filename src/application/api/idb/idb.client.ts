import { type DBSchema, type IDBPDatabase, openDB } from 'idb'
import type { MediaItem, SearchItem } from '@/domain/entities'

export interface MyDB extends DBSchema {
  media: { key: number; value: MediaItem }
  search: { key: string; value: SearchItem }
}

let db: IDBPDatabase<MyDB> | undefined

export async function getDb(uid: string): Promise<IDBPDatabase<MyDB>> {
  if (db) return db

  const dbName = `appdb-v0-${uid}`
  db = await openDB<MyDB>(dbName, 1, {
    upgrade(db) {
      db.createObjectStore('media', { keyPath: 'id' })
      db.createObjectStore('search', { keyPath: 'id' })
    },
  })

  return db
}

export function closeDb(): void {
  db?.close()
  db = undefined
}

export function onUserChange(uid: string): void {
  if (db) db.close()
  db = undefined
  void getDb(uid)
}
