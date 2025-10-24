import { type } from 'arktype'

const scheme = type({
  TMDB_TOKEN: 'string > 1',
  VERCEL: type('string.integer.parse').pipe(Boolean),
  MONGO_URI: 'string.url',
  DB_NAME: 'string',
})

export const ENV = {
  ...scheme.assert(process.env),
  TMDB_BASE: 'https://api.themoviedb.org/3',
}
