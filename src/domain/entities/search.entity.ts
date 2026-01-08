export type SearchEntity = 'movie' | 'tv' | 'person'

export interface SearchItem {
  id: string
  query: string
  entity: SearchEntity
  addedAt: Date
}
