import { type DBSchema, type IDBPDatabase, openDB } from 'idb'
import { atom } from 'nanostores'
import { authStore } from '@/hooks/useFireAuth'

export type MediaItem = {
  id: number
  title: string
  media_type: 'movie' | 'tv'
  progress: number // 0-100
  timestamp: number // playback in seconds
  duration: number // duration in seconds
  season: number
  episode: number
  poster_path: string | null
  status: 'completed' | 'watching'
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

authStore.subscribe(async (store) => {
  if (db) db.close()

  const uid = store.user?.uid || 'guest'
  const dbName = `appdb-v0-${uid}`
  db = await openDB<MyDB>(dbName, 1, {
    upgrade(db) {
      db.createObjectStore('media', { keyPath: 'id' })
      db.createObjectStore('search', { keyPath: 'id' })
    },
  })
  console.log(`IDB opened: ${dbName}`)

  //refresh stores
  Search.refresh()
  MyMedias.refresh()
})

function getDb() {
  if (!db) throw new Error('IDB not initialized')
  return db
}

const $searches = atom<SearchItem[]>([])
const $myMedias = atom<MediaItem[]>([])

export const Search = {
  store: $searches,
  async refresh() {
    const v = await getDb().getAll('search')
    $searches.set(v)
  },
  async add(item: Omit<SearchItem, 'addedAt' | 'id'>) {
    const db = getDb()
    const id = `${item.entity}-${item.query}`
    if (await db.get('search', id)) return
    await db.add('search', { ...item, id, addedAt: new Date() })
    await this.refresh()
  },
  async remove(id: string) {
    await getDb().delete('search', id)
    await this.refresh()
  },
  async clear() {
    await getDb().clear('search')
    await this.refresh()
  },
}

export const MyMedias = {
  store: $myMedias,
  async refresh() {
    const v = await getDb().getAll('media')
    $myMedias.set(v)
  },
  async add(
    item: Pick<
      MediaItem,
      'id' | 'title' | 'media_type' | 'poster_path' | 'season' | 'episode'
    >,
  ) {
    await getDb().put('media', {
      ...item,
      duration: 0,
      timestamp: 0,
      progress: 0,
      status: 'watching',
    })
    await this.refresh()
  },
  async remove(id: MediaItem['id']) {
    await getDb().delete('media', id)
    await this.refresh()
  },
  async changeStatus(id: MediaItem['id'], status: MediaItem['status']) {
    const media = await getDb().get('media', id)
    if (!media) return
    await getDb().put('media', { ...media, status })
    await this.refresh()
  },
}
