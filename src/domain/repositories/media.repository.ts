import type {
  MediaItem,
  MediaItemInput,
  MediaStatus,
} from '../entities/media.entity'

export interface IMediaRepository {
  getAll(): Promise<MediaItem[]>
  add(item: MediaItemInput): Promise<void>
  remove(id: number): Promise<void>
  updateStatus(id: number, status: MediaStatus): Promise<void>
}
