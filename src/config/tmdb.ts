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

export const tmdb = { api, isError, isMovie }

export type { TMDB }
