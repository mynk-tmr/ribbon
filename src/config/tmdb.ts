import { ofetch } from 'ofetch'
import type * as TMDB from './+tmdb.types'

const api = ofetch.create({
  baseURL: import.meta.env.DEV ? 'http://localhost:3000/api/tmdb' : '/api/tmdb',
  credentials: 'include',
  ignoreResponseError: false,
})

const isMovie = (e: TMDB.Media): e is TMDB.Movie => 'release_date' in e

type Entity = 'movie' | 'tv' | 'person'
type Criteria = 'popular' | 'top_rated' | 'upcoming' | 'now_playing'

type FullCriteria = Criteria | 'airing_today' | 'on_the_air'
type PagedResult = TMDB.Paginated<TMDB.Movie | TMDB.TV | TMDB.Person>
type ID = string | number

function getCriteria(criteria: Criteria, entity: Entity): FullCriteria {
  if (entity === 'movie') return criteria
  if (entity === 'tv')
    return criteria === 'now_playing'
      ? 'airing_today'
      : criteria === 'upcoming'
        ? 'on_the_air'
        : criteria
  return 'popular'
}

function getDiscover<R>(entity: Entity) {
  return (criteria: Criteria, page: number) =>
    api<R>(`/${entity}/${getCriteria(criteria, entity)}?page=${page}`)
}

function getRecommendations<R>(entity: Entity) {
  return (id: ID, page: number) =>
    api<TMDB.Paginated<R>>(`/${entity}/${id}/recommendations?page=${page}`)
}

export const tmdb = {
  isMovie,
  details: {
    movie: (id: ID) => api<TMDB.MovieDetail>(`/movie/${id}`),
    tv: (id: ID) => api<TMDB.TVDetail>(`/tv/${id}`),
    person: (id: ID) => api<TMDB.PersonDetails>(`/person/${id}`),
  },
  discover: (entity: Entity) => getDiscover<PagedResult>(entity),
  search: (query: string, type: Entity, page: number) =>
    api<PagedResult>(`/search/${type}?query=${query}&page=${page}`),
  person: {
    credits: (id: ID) => api<TMDB.CombinedCredits>(`/person/${id}/combined_credits`),
  },
  recommendations: (entity: Entity) => getRecommendations<TMDB.Movie | TMDB.TV>(entity),
  tv: {
    season: (id: ID, season: number) =>
      api<TMDB.SeasonDetail>(`/tv/${id}/season/${season}`),
  },
}

export type { TMDB }
