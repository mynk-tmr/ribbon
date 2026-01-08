// Media DTOs for frontend

export type MediaType = 'movie' | 'tv'
export type MediaStatus = 'completed' | 'watching'

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
  updatedAt: string
  // From tmdb_metadata
  id: number
  media_type: MediaType
  title: string
  poster_path: string | null
}

export interface MediaAddInput {
  id: number
  media_type: MediaType
  title: string
  poster_path: string | null
  season?: number
  episode?: number
}

export type MediaProgressInput = Partial<{
  progress: number
  timestamp: number
  duration: number
  season: number | null
  episode: number | null
}>

export interface MediaStatusInput {
  status: MediaStatus
}
