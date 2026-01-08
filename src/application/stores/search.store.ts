import { atom } from 'nanostores'
import type { SearchEntity, SearchItem } from '@/dtos/search.dto'
import { SearchAPI } from './api-store'
import { authStore } from './auth.store'

const $search = atom<SearchItem[]>([])

export const searchStore = {
  store: $search,

  async refresh(): Promise<void> {
    const user = authStore.value.user
    if (!user) {
      $search.set([])
      return
    }

    const items = await SearchAPI.getAll()
    $search.set(items)
  },

  async add(query: string, entity: SearchEntity): Promise<void> {
    const user = authStore.value.user
    if (!user) return

    await SearchAPI.add({ query, entity })
    await this.refresh()
  },

  async remove(id: string): Promise<void> {
    const user = authStore.value.user
    if (!user) return

    await SearchAPI.remove(id)
    await this.refresh()
  },

  async clear(): Promise<void> {
    const user = authStore.value.user
    if (!user) return

    await SearchAPI.clear()
    await this.refresh()
  },
}
