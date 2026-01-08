import { atom } from 'nanostores'
import type { MediaItem, MediaItemInput, MediaStatus } from '@/domain/entities'
import { getDb } from '../api/idb/idb.client'

const $media = atom<MediaItem[]>([])

export const mediaStore = {
  store: $media,

  async refresh(): Promise<void> {
    const uid = 'guest' // TODO: Get from auth
    const db = await getDb(uid)
    const items = await db.getAll('media')
    $media.set(items)
  },

  async add(item: MediaItemInput): Promise<void> {
    const uid = 'guest'
    const db = await getDb(uid)
    await db.put('media', {
      ...item,
      duration: 0,
      timestamp: 0,
      progress: 0,
      status: 'watching',
    })
    await this.refresh()
  },

  async remove(id: number): Promise<void> {
    const uid = 'guest'
    const db = await getDb(uid)
    await db.delete('media', id)
    await this.refresh()
  },

  async updateStatus(id: number, status: MediaStatus): Promise<void> {
    const uid = 'guest'
    const db = await getDb(uid)
    const media = await db.get('media', id)
    if (!media) return
    await db.put('media', { ...media, status })
    await this.refresh()
  },
}
