import { atom } from 'nanostores'
import type { SearchEntity, SearchItem } from '@/dtos/search.dto'
import { API } from '../api'
import { authStore } from './auth.store'

const $search = atom<SearchItem[]>([])

export const searchStore = {
  store: $search,

  async refresh() {
    if (!authStore.value.user) return $search.set([])

    const items = await API.search.getAll()
    $search.set(items)
  },

  async add(query: string, entity: SearchEntity) {
    if (authStore.value.user) {
      await API.search.add({ query, entity })
      await this.refresh()
    }
  },

  async remove(id: string) {
    await API.search.remove(id)
    await this.refresh()
  },

  async clear() {
    await API.search.clear()
    await this.refresh()
  },
}

// Auto-sync search history with auth state
authStore.store.subscribe(() => searchStore.refresh())
