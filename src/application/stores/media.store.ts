import { atom } from 'nanostores'
import type { MediaAddInput, MediaItem, MediaStatus } from '@/dtos/media.dto'
import { MediaAPI } from './api-store'
import { authStore } from './auth.store'

const $media = atom<MediaItem[]>([])

export const mediaStore = {
  store: $media,

  async refresh(): Promise<void> {
    const user = authStore.value.user
    if (!user) {
      $media.set([])
      return
    }

    const items = await MediaAPI.getAll()
    $media.set(items)
  },

  async add(item: MediaAddInput): Promise<void> {
    const user = authStore.value.user
    if (!user) return

    await MediaAPI.add({
      id: item.id,
      media_type: item.media_type,
      title: item.title,
      poster_path: item.poster_path,
    })
    await this.refresh()
  },

  async remove(id: number): Promise<void> {
    const user = authStore.value.user
    if (!user) return

    await MediaAPI.remove(id)
    await this.refresh()
  },

  async updateStatus(id: number, status: MediaStatus): Promise<void> {
    const user = authStore.value.user
    if (!user) return

    await MediaAPI.updateStatus(id, { status })
    await this.refresh()
  },

  async updateProgress(
    id: number,
    progress: { progress: number; timestamp: number; duration: number },
  ): Promise<void> {
    const user = authStore.value.user
    if (!user) return

    await MediaAPI.updateProgress(id, {
      progress: progress.progress,
      timestamp: progress.timestamp,
      duration: progress.duration,
      season: null,
      episode: null,
    })
    await this.refresh()
  },
}
