import type { SearchAddInput, SearchItem } from '@/dtos/search.dto'
import { api } from './+api-config'

export const SearchAPI = {
  async getAll(): Promise<SearchItem[]> {
    return api<SearchItem[]>('/search')
  },

  async add(body: SearchAddInput): Promise<SearchItem> {
    return api<SearchItem>('/search', { method: 'POST', body })
  },

  async remove(id: string): Promise<{ success: boolean }> {
    return api<{ success: boolean }>(`/search/${id}`, { method: 'DELETE' })
  },

  async clear(): Promise<{ success: boolean }> {
    return api<{ success: boolean }>('/search', { method: 'DELETE' })
  },
}
