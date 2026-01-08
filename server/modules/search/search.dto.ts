import { type } from 'arktype'

// Search entity types
export type SearchEntity = 'movie' | 'tv' | 'person'

// Input validation schemas
export const searchAddInputSchema = type({
  query: 'string > 0',
  entity: "'movie' | 'tv' | 'person'",
})

// Types
export type SearchAddInput = typeof searchAddInputSchema.infer

// Database types
export interface SearchItem {
  _id: string
  uid: string
  query: string
  entity: SearchEntity
  addedAt: Date
}
