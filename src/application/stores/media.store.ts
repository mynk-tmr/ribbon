import { atom } from 'nanostores'
import type {
  MediaAddInput,
  MediaItem,
  MediaProgressInput,
  MediaStatus,
} from '@/dtos/media.dto'
import { API } from '../api'
import { authStore } from './auth.store'

const $media = atom<MediaItem[]>([])

export const mediaStore = {
  store: $media,

  async refresh() {
    // Only fetch if we have a user, otherwise reset
    if (!authStore.value.user) return $media.set([])

    const items = await API.media.getAll()
    $media.set(items)
  },

  has: (id: number) => $media.get().some((m) => m.id === id),

  async add(body: MediaAddInput) {
    await API.media.add(body)
    await this.refresh()
  },

  async remove(id: number) {
    await API.media.remove(id)
    await this.refresh()
  },

  async updateStatus(id: number, status: MediaStatus) {
    await API.media.updateStatus(id, { status })
    await this.refresh()
  },

  async updateProgress(id: number, progress: MediaProgressInput) {
    await API.media.updateProgress(id, progress)
    await this.refresh()
  },
}

// Auto-refresh media whenever auth state changes
authStore.store.subscribe(() => mediaStore.refresh())
