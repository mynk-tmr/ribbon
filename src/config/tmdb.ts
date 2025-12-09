import { ofetch } from 'ofetch'
import type * as TMDB from './+tmdb.types'

type Entity = 'movie' | 'tv' | 'person'
type Criteria = 'popular' | 'top_rated' | 'upcoming' | 'now_playing'
type FullCriteria = Criteria | 'airing_today' | 'on_the_air'
type ID = string | number

const api = ofetch.create({
  baseURL: '/api/tmdb',
  credentials: 'include',
  ignoreResponseError: false,
})

export type { TMDB }

// biome-ignore lint/suspicious/noExplicitAny: h
function normalise(e: unknown): any {
  if (e === null) return null
  if (typeof e !== 'object') return e
  if (Array.isArray(e)) return e.map((e) => normalise(e))
  if ('release_date' in e) return { ...e, media_type: 'movie' }
  if ('first_air_date' in e && 'name' in e)
    return {
      ...e,
      media_type: 'tv',
      title: e.name,
      release_date: e.first_air_date,
    }
  return { ...e, media_type: 'person' }
}

function normalisePaginated<T>(res: TMDB.Paginated<T>) {
  if (res.results.length > 0) res.results = normalise(res.results)
  return res
}

async function details<T>(entity: Entity, id: ID) {
  const res = await api(`/${entity}/${id}`)
  const e = normalise(res)
  return e as T
}

async function similar(entity: Entity, id: ID, page: number) {
  const res = await api<TMDB.Paginated<TMDB.Media>>(
    `/${entity}/${id}/recommendations`,
    { params: { page } },
  )
  return normalisePaginated(res)
}

async function search<T>(entity: Entity, query: string, page: number) {
  const res = await api<TMDB.Paginated<T>>(`/search/${entity}`, {
    params: { query, page },
  })
  return normalisePaginated(res)
}

function season(id: ID, season: number) {
  return api<TMDB.SeasonDetail>(`/tv/${id}/season/${season}`)
}

async function credits(id: ID): Promise<TMDB.CombinedCredits> {
  const res = await api<TMDB.CombinedCredits>(`/person/${id}/combined_credits`)
  return { id: res.id, cast: normalise(res.cast), crew: normalise(res.crew) }
}

function getCriteria(criteria: Criteria, entity: Entity): FullCriteria {
  if (entity === 'movie') return criteria
  if (entity === 'tv') {
    if (criteria === 'now_playing') return 'airing_today'
    if (criteria === 'upcoming') return 'on_the_air'
    return criteria
  }
  return 'popular'
}

async function discover<T>(entity: Entity, criteria: Criteria, page: number) {
  const res = await api<TMDB.Paginated<T>>(
    `/${entity}/${getCriteria(criteria, entity)}`,
    { params: { page } },
  )
  return normalisePaginated(res)
}

function isMovie(media: TMDB.Media): media is TMDB.MovieDetail {
  return media.media_type === 'movie'
}

function streamUrl(id: ID, season?: number, episode?: number) {
  if (season === undefined || episode === undefined) {
    return `https://vidsrc.xyz/embed/movie/${id}`
  } else {
    return `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}`
  }
}

export const tmdb = {
  details,
  similar,
  search,
  season,
  person: { credits },
  discover,
  isMovie,
  normalise,
  streamUrl,
}
