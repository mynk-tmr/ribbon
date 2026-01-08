/* ---------- BASE TYPES ---------- */

export interface Paginated<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface Genre {
  id: number
  name: string
}

export interface Image {
  aspect_ratio: number
  height: number
  file_path: string
  width: number
}

export interface Company {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

/* ---------- MEDIA & PERSON ---------- */

export interface Media {
  media_type: 'movie' | 'tv'
  title: string
  release_date: string
  adult: boolean
  genre_ids: number[]
  id: number
  overview?: string
  popularity: number
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  original_language: string
  character?: string
}

export interface Person {
  media_type: 'person'
  id: number
  name: string
  profile_path: string | null
  known_for: Media[]
  known_for_department: string
  popularity: number
  gender: number
  adult: boolean
}

/* ---------- DETAILS ---------- */

export interface DetailBase extends Media {
  homepage: string
  genres: Genre[]
  production_companies: Company[]
  production_countries: { iso_3166_1: string; name: string }[]
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[]
  status: string
  tagline: string
}

export interface MovieDetail extends DetailBase {
  belongs_to_collection: null | {
    id: number
    name: string
    poster_path: string | null
    backdrop_path: string | null
  }
  budget: number
  imdb_id: string | null
  revenue: number
  runtime: number | null
  origin_country: string[]
}

export interface TVDetail extends DetailBase {
  created_by: Person[]
  episode_run_time: number[]
  in_production: boolean
  languages: string[]
  last_air_date: string
  last_episode_to_air: Episode | null
  next_episode_to_air: Episode | null
  networks: Company[]
  number_of_episodes: number
  number_of_seasons: number
  origin_country: string[]
  seasons: Season[]
}

export interface PersonDetails extends Person {
  also_known_as: string[]
  biography: string
  birthday: string | null
  deathday: string | null
  homepage: string | null
  imdb_id: string | null
  place_of_birth: string | null
}

/* ---------- SEASON & EPISODE ---------- */

export interface Episode {
  id: number
  name: string
  overview: string
  vote_average: number
  vote_count: number
  air_date: string
  episode_number: number
  episode_type?: string
  production_code?: string
  runtime: number | null
  season_number: number
  show_id: number
  still_path: string | null
}

export interface Season {
  air_date: string
  episode_count: number
  id: number
  name: string
  overview?: string
  poster_path: string | null
  season_number: number
  vote_average: number
}

export interface SeasonDetail extends Season {
  _id: string
  episodes: EpisodeDetail[]
  networks?: Company[]
}

export interface EpisodeDetail extends Episode {
  crew: Person[]
  guest_stars: Person[]
}

/* ---------- CREDITS ---------- */

export interface CombinedCredits {
  id: number
  cast: Media[]
  crew: Media[]
}
