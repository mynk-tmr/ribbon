import { type } from 'arktype'

const scheme = type({
  TMDB_TOKEN: 'string > 1',
  VERCEL: type('string.integer.parse').pipe(Boolean),
})

export const ENV = {
  ...scheme.assert(process.env),
  TMDB_BASE: 'https://api.themoviedb.org/3',
}
