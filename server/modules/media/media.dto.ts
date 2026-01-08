import { type } from 'arktype'

// Media types
export type MediaType = 'movie' | 'tv'
export type MediaStatus = 'completed' | 'watching'

// Input validation schemas
export const mediaAddInputSchema = type({
  id: 'number > 0',
  media_type: "'movie' | 'tv'",
  title: 'string > 0',
  poster_path: 'string | null',
  'season?': 'number >= 0',
  'episode?': 'number >= 0',
})

export const mediaProgressInputSchema = type({
  progress: 'number >= 0 & number <= 100',
  timestamp: 'number >= 0',
  duration: 'number > 0',
  season: 'number >= 0 | null',
  episode: 'number >= 0 | null',
}).partial()

export const mediaStatusInputSchema = type({
  status: "'completed' | 'watching'",
})

// Types
export type MediaAddInput = typeof mediaAddInputSchema.infer
export type MediaProgressInput = typeof mediaProgressInputSchema.infer
export type MediaStatusInput = typeof mediaStatusInputSchema.infer

// Database types
export interface TMDBMetadata {
  _id: string
  id: number
  media_type: MediaType
  title: string
  poster_path: string | null
}

export interface UserMedia {
  _id: string
  uid: string
  metadata_id: string
  progress: number
  timestamp: number
  duration: number
  season: number | null
  episode: number | null
  status: MediaStatus
  updatedAt: Date
}

// Response types (with aggregation lookup)
export interface MediaItem {
  _id: string
  uid: string
  metadata_id: string
  progress: number
  timestamp: number
  duration: number
  season: number | null
  episode: number | null
  status: MediaStatus
  updatedAt: Date
  // From tmdb_metadata
  id: number
  media_type: MediaType
  title: string
  poster_path: string | null
}
