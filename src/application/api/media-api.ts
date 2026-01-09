import type {
  MediaAddInput,
  MediaItem,
  MediaProgressInput,
  MediaStatusInput,
} from '@/dtos/media.dto'
import { api } from './+api-config'

export const MediaAPI = {
  async getAll(): Promise<MediaItem[]> {
    return api<MediaItem[]>('/media')
  },

  async add(body: MediaAddInput): Promise<MediaItem> {
    return api<MediaItem>('/media', { method: 'POST', body })
  },

  async remove(tmdbId: number): Promise<{ success: boolean }> {
    return api<{ success: boolean }>(`/media/${tmdbId}`, { method: 'DELETE' })
  },

  async updateStatus(
    tmdbId: number,
    body: MediaStatusInput,
  ): Promise<{ success: boolean }> {
    return api<{ success: boolean }>(`/media/${tmdbId}/status`, {
      method: 'PATCH',
      body,
    })
  },

  async updateProgress(
    tmdbId: number,
    body: MediaProgressInput,
  ): Promise<{ success: boolean }> {
    return api<{ success: boolean }>(`/media/${tmdbId}/progress`, {
      method: 'PUT',
      body,
    })
  },
}
