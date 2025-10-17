import { ofetch } from 'ofetch'
import type * as TMDB from './+types'

const { DEV } = import.meta.env

const api = ofetch.create({
  baseURL: DEV ? 'http://localhost:3000/api/tmdb' : 'api/tmdb',
  ignoreResponseError: true,
})

function isError(item: unknown): item is TMDB.Error {
  if (!item || typeof item !== 'object') return false
  return 'status_code' in item
}

async function call<T>(...args: Parameters<typeof api>): Promise<{
  data: null | T
  error: null | TMDB.Error
}> {
  const res = await api(...args)
  if (isError(res)) return { data: null, error: res }
  return { data: res as T, error: null }
}

function makeapi<T, Detail>(type: 'tv' | 'movie') {
  function paged(path: string) {
    return (page: number) => call<TMDB.Paginated<T>>(path, { params: { page } })
  }

  return {
    popular: paged(`${type}/popular`),
    top_rated: paged(`${type}/top_rated`),
    trending: (dur: 'day' | 'week') => paged(`/trending/${type}/${dur}`)(1),
    details: (id: number) => call<Detail>(`${type}/${id}`),
    recommendations: (id: number, page: number) =>
      paged(`${type}/${id}/recommendations`)(page),
    credits: (id: number) => call<TMDB.Credit>(`${type}/${id}/credits`),
    images: (id: number) => call<TMDB.ImgCollection>(`${type}/${id}/images`),
    search: (params: TMDB.SearchParams) =>
      call<TMDB.Paginated<T>>(`search/${type}`, { params }),
    discover: (params: TMDB.DiscoverParams) =>
      call<TMDB.Paginated<T>>(`discover/${type}`, { params }),
    genres: () => call<{ genres: TMDB.Genre[] }>(`genre/${type}/list`),
  }
}

export type PosterSize =
  | 'w92'
  | 'w154'
  | 'w185'
  | 'w342'
  | 'w500'
  | 'w780'
  | 'original'

function pic(poster: PosterSize, path: string) {
  return `https://image.tmdb.org/t/p/${poster}${path}`
}

function isMovie(item: TMDB.Movie | TMDB.TV): item is TMDB.Movie {
  return 'title' in item
}

export const tmdb = {
  movie: makeapi<TMDB.Movie, TMDB.MovieDetail>('movie'),
  tv: {
    ...makeapi<TMDB.TV, TMDB.TVDetail>('tv'),
    season: (tvid: number, num: number) =>
      call<TMDB.SeasonDetail>(`tv/${tvid}/season/${num}`),
  },
  pic,
  call,
  isMovie,
  isError,
}

export type { TMDB }
