import type { MediaAddInput, MediaItem, MediaStatus } from '@/dtos/media.dto'

export interface IMediaRepository {
  getAll(): Promise<MediaItem[]>
  add(item: MediaAddInput): Promise<void>
  remove(id: number): Promise<void>
  updateStatus(id: number, status: MediaStatus): Promise<void>
}
