import { atom } from 'nanostores'
import type { SearchEntity, SearchItem } from '@/domain/entities'
import { getDb } from '../api/idb/idb.client'

const $search = atom<SearchItem[]>([])

export const searchStore = {
  store: $search,

  async refresh(): Promise<void> {
    const uid = 'guest' // TODO: Get from auth
    const db = await getDb(uid)
    const items = await db.getAll('search')
    $search.set(items)
  },

  async add(query: string, entity: SearchEntity): Promise<void> {
    const uid = 'guest'
    const db = await getDb(uid)
    const id = `${entity}-${query}`
    if (await db.get('search', id)) return
    await db.add('search', { id, query, entity, addedAt: new Date() })
    await this.refresh()
  },

  async remove(id: string): Promise<void> {
    const uid = 'guest'
    const db = await getDb(uid)
    await db.delete('search', id)
    await this.refresh()
  },

  async clear(): Promise<void> {
    const uid = 'guest'
    const db = await getDb(uid)
    await db.clear('search')
    await this.refresh()
  },
}
