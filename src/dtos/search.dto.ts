// Search DTOs for frontend

export type SearchEntity = 'movie' | 'tv' | 'person'

export interface SearchItem {
  _id: string
  uid: string
  query: string
  entity: SearchEntity
  addedAt: string
}

export interface SearchAddInput {
  query: string
  entity: SearchEntity
}
