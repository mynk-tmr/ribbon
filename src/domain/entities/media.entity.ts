export type MediaStatus = 'completed' | 'watching'

export interface MediaItem {
  id: number
  title: string
  media_type: 'movie' | 'tv'
  progress: number // 0-100
  timestamp: number // playback in seconds
  duration: number // duration in seconds
  season: number
  episode: number
  poster_path: string | null
  status: MediaStatus
}

export interface MediaItemInput {
  id: number
  title: string
  media_type: 'movie' | 'tv'
  poster_path: string | null
  season: number
  episode: number
}
