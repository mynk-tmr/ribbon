import { ofetch } from 'ofetch'
import type * as TMDB from './+tmdb.types'

const api = ofetch.create({
  baseURL: import.meta.env.DEV ? 'http://localhost:3000/api/tmdb' : '/api/tmdb',
  credentials: 'include',
  ignoreResponseError: false,
})

const isError = (e: unknown): e is TMDB.Error =>
  typeof e === 'object' && e !== null && 'status_code' in e

const isMovie = (e: TMDB.Media): e is TMDB.Movie => 'release_date' in e

export const tmdb = { api, isError, isMovie, dispatch }

export type { TMDB }

type Actions =
  | {
      type: 'details'
      payload: { media: 'movie' | 'tv' | 'person'; id: number | string }
    }
  | {
      type: 'recommendations'
      payload: { media: 'movie' | 'tv'; id: number | string; page: number }
    }
  | {
      type: 'search'
      payload: { query: string; by: 'movie' | 'tv' | 'person'; page: number }
    }
  | { type: 'season'; payload: { id: number | string; season: number | string } }

function dispatch<T>(action: Actions) {
  let url = ''
  switch (action.type) {
    case 'details':
      url = `/${action.payload.media}/${action.payload.id}`
  }
  switch (action.type) {
    case 'recommendations':
      url = `/${action.payload.media}/${action.payload.id}/recommendations?page=${action.payload.page}`
  }
  switch (action.type) {
    case 'search':
      url = `/search/${action.payload.by}?query=${action.payload.query}&page=${action.payload.page}`
  }
  switch (action.type) {
    case 'season':
      url = `/tv/${action.payload.id}/season/${action.payload.season}`
  }
  return api<T>(url)
}
