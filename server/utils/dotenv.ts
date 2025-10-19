import { type } from 'arktype'

const scheme = type({
  TMDB_TOKEN: 'string > 1',
  VERCEL: type('string.integer.parse').pipe(Boolean),
  DB_NAME: 'string > 1',
  MONGO_URI: 'string > 1',
  JWT_SECRET: 'string > 1',
})

export const ENV = {
  ...scheme.assert(process.env),
  TMDB_BASE: 'https://api.themoviedb.org/3',
}
