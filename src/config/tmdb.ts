import { ofetch } from 'ofetch'
import type * as TMDB from './+tmdb.types'

const api = ofetch.create({
  baseURL: import.meta.env.DEV ? 'http://localhost:3000/api/tmdb' : '/api/tmdb',
  credentials: 'include',
  ignoreResponseError: false,
})

const isMovie = (e: TMDB.Media): e is TMDB.Movie => 'release_date' in e

type Entity = 'movie' | 'tv' | 'person'
type MovieDisc = 'popular' | 'top_rated' | 'upcoming' | 'now_playing'
type TVDisc = 'airing_today' | 'on_the_air' | 'popular' | 'top_rated'
type PagedMovie = TMDB.Paginated<TMDB.Movie>
type PagedTV = TMDB.Paginated<TMDB.TV>
type PagedPerson = TMDB.Paginated<TMDB.Person>
type ID = string | number

export const tmdb = {
  isMovie,
  details: {
    movie: (id: ID) => api<TMDB.MovieDetail>(`/movie/${id}`),
    tv: (id: ID) => api<TMDB.TVDetail>(`/tv/${id}`),
    person: (id: ID) => api<TMDB.PersonDetails>(`/person/${id}`),
  },
  discover: {
    movie: (criteria: MovieDisc, page: number) =>
      api<PagedMovie>(`/movie/${criteria}?page=${page}`),
    tv: (criteria: TVDisc, page: number) => api<PagedTV>(`/tv/${criteria}?page=${page}`),
    person: (page: number) => api<PagedPerson>(`/person/popular?page=${page}`),
  },
  search: (query: string, type: Entity, page: number) =>
    api<PagedMovie | PagedTV | PagedPerson>(
      `/search/${type}?query=${query}&page=${page}`,
    ),
  person: {
    credits: (id: ID) => api<TMDB.CombinedCredits>(`/person/${id}/combined_credits`),
  },
  recommendations: {
    movie: (id: ID, page: number) =>
      api<PagedMovie>(`/movie/${id}/recommendations?page=${page}`),
    tv: (id: ID, page: number) => api<PagedTV>(`/tv/${id}/recommendations?page=${page}`),
  },
  tv: {
    season: (id: ID, season: number) =>
      api<TMDB.SeasonDetail>(`/tv/${id}/season/${season}`),
  },
}

export type { TMDB }
