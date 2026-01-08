import type { SearchEntity, SearchItem } from '../entities/search.entity'

export interface ISearchRepository {
  getAll(): Promise<SearchItem[]>
  add(query: string, entity: SearchEntity): Promise<void>
  remove(id: string): Promise<void>
  clear(): Promise<void>
}
