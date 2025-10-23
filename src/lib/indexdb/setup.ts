import { onAuthStateChanged } from 'firebase/auth'
import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import { auth } from '../firebase/init'
import { RibbonDBActions } from './stores'

export interface IMedia {
  id: number
  title: string
  poster_path: string
  progress: number
  favourite: boolean
  addedAt: Date
  updatedAt: Date
  media: 'movie' | 'tv'
  season?: number
  end?: number
  episode?: number
}

export interface RibbonDB extends DBSchema {
  media: { key: number; value: IMedia }
  search: { key: string; value: { title: string; addedAt: Date } }
}

export type ISearch = RibbonDB['search']['value']

function getDB(uid: string) {
  return openDB<RibbonDB>(`RibbonDB-${uid}`, 1, {
    upgrade(db) {
      db.createObjectStore('media', { keyPath: 'id' })
      db.createObjectStore('search', { keyPath: 'title' })
    },
  })
}

export let indexdb: IDBPDatabase<RibbonDB>

onAuthStateChanged(auth, async (user) => {
  const dbname = `${user?.uid || 'guest'}`
  indexdb = await getDB(dbname)
  console.log('Database ready', indexdb.name)
  await RibbonDBActions.reloadAll()
})
