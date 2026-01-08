import type { IMediaRepository } from '@/domain/repositories/media.repository'
import { mediaStore } from '../stores/media.store'

export const mediaService: IMediaRepository = {
  getAll: async () => {
    await mediaStore.refresh()
    return mediaStore.store.get() || []
  },
  add: (item) => mediaStore.add(item),
  remove: (id) => mediaStore.remove(id),
  updateStatus: (id, status) => mediaStore.updateStatus(id, status),
}
