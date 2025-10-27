/* ---------- BASE TYPES ---------- */
export interface Error {
  status_code: number
  status_message: string
  success: boolean
}

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

export interface Media {
  adult: boolean
  backdrop_path: string | null
  genre_ids: number[]
  id: number
  overview: string
  popularity: number
  poster_path: string | null
  vote_average: number
  vote_count: number
  original_language: string
}

export interface Company {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface Country {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export type KnownFor = { media_type: 'movie' | 'tv'; character?: string } & (Movie | TV)

export interface Person {
  id: number
  name: string
  profile_path: string | null
  known_for: KnownFor[]
  known_for_department: string
  popularity: number
  gender: number
  adult: boolean
}

export interface Creator extends Person {
  credit_id: string
  original_name: string
}

export interface Cast extends Person {
  character: string
}

export interface Crew extends Person {
  job: string
  department: string
}

export interface Image {
  aspect_ratio: number
  height: number
  iso_3166_1: string | null
  iso_639_1: string | null
  file_path: string
  vote_average: number
  vote_count: number
  width: number
}

export interface DetailBase extends Media {
  homepage: string
  genres: Genre[]
  id: number
  production_companies: Company[]
  production_countries: Country[]
  spoken_languages: SpokenLanguage[]
  popularity: number
  poster_path: string | null
  status: string
  tagline: string
  vote_average: number
  vote_count: number
}

/* ---------- RETURNDED BY API ---------- */
export interface Movie extends Media {
  original_title: string
  release_date: string
  title: string
  video: boolean
}

export interface TV extends Media {
  origin_country: string[]
  original_name: string
  first_air_date: string
  name: string
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
  original_title: string
  release_date: string
  revenue: number
  runtime: number | null
  title: string
  video: boolean
  origin_country: string[]
}

export interface TVDetail extends DetailBase {
  created_by: Creator[]
  episode_run_time: number[]
  first_air_date: string
  in_production: boolean
  languages: string[]
  last_air_date: string
  last_episode_to_air: Episode | null
  name: string
  next_episode_to_air: Episode | null
  networks: Company[]
  number_of_episodes: number
  number_of_seasons: number
  origin_country: string[]
  original_name: string
  seasons: Season[]
  type: string
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

export interface CombinedCredits {
  id: number
  cast: KnownFor[]
  crew: KnownFor[]
}

export interface ImgCollection {
  id: number
  backdrops: Image[]
  logos: Image[]
  posters: Image[]
}

export interface EpisodeDetail extends Episode {
  crew: Crew[]
  guest_stars: Cast[]
  episode_type?: string
  production_code?: string
}

export interface SeasonDetail extends Season {
  _id: string
  air_date: string
  episodes: EpisodeDetail[]
  networks?: Company[]
}

/* ---------- QUERIES ---------- */

export interface SearchParams {
  query: string
  page?: number
  region?: string
  language?: string
  include_adult?: boolean
  year?: number
  primary_release_year?: number
}

interface SupportsANDOR {
  // '920,93' (and)  '920|94' (or)
  with_cast?: string
  with_companies?: string
  with_crew?: string
  with_genres?: string
  with_keywords?: string
  with_people?: string
  with_release_type?: string // 1,2,3,4,5,6 only
}

export interface DiscoverParams extends SupportsANDOR {
  certification?: string
  'certification.gte'?: string
  'certification.lte'?: string
  certification_country?: string
  include_adult?: boolean
  include_video?: boolean
  language?: string
  page?: number
  primary_release_year?: number
  'primary_release_date.gte'?: string
  'primary_release_date.lte'?: string
  region?: string
  'release_date.gte'?: string
  'release_date.lte'?: string
  sort_by?:
    | 'popularity.asc'
    | 'popularity.desc'
    | 'release_date.asc'
    | 'release_date.desc'
    | 'revenue.asc'
    | 'revenue.desc'
    | 'primary_release_date.asc'
    | 'primary_release_date.desc'
    | 'original_title.asc'
    | 'original_title.desc'
    | 'vote_average.asc'
    | 'vote_average.desc'
    | 'vote_count.asc'
    | 'vote_count.desc'
  'vote_average.gte'?: number
  'vote_average.lte'?: number
  'vote_count.gte'?: number
  'vote_count.lte'?: number
  watch_region?: string
  with_origin_country?: string
  with_original_language?: string
  'with_runtime.gte'?: number
  'with_runtime.lte'?: number
  with_watch_monetization_types?: string
  with_watch_providers?: string
  without_companies?: string
  without_genres?: string
  without_keywords?: string
  without_watch_providers?: string
  year?: number
}
