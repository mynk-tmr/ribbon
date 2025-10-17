import { type } from 'arktype'

const scheme = type({
  TMDB_TOKEN: 'string > 1',
  VERCEL: 'string.integer.parse',
})

export const ENV = {
  ...scheme.assert(process.env),
  TMDB_BASE: 'https://api.themoviedb.org/3',
}
