import type { ISearchRepository } from '@/domain/repositories/search.repository'
import { searchStore } from '../stores/search.store'

export const searchService: ISearchRepository = {
  getAll: async () => {
    await searchStore.refresh()
    return searchStore.store.get() || []
  },
  add: (query, entity) => searchStore.add(query, entity),
  remove: (id) => searchStore.remove(id),
  clear: () => searchStore.clear(),
}
