import { type } from 'arktype'
import type { MongoClientOptions } from 'mongodb'

const scheme = type({
  TMDB_TOKEN: 'string > 1',
  VERCEL: type('string.integer.parse').pipe(Boolean),
  MONGODB_URI: 'string > 1',
  JWT_SECRET: 'string >= 32',
  APP_URL: 'string > 1',
})

const env = scheme.assert(process.env)

export const ENV = {
  ...env,
  TMDB_BASE: 'https://api.themoviedb.org/3',
  JWT_EXPIRES_IN: 7 * 24 * 60 * 60, // 7 days in seconds
  MAGIC_LINK_EXPIRES_IN: 15 * 60, // 15 minutes in seconds
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: !env.VERCEL,
    sameSite: 'Lax' as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  MONGODB_OPTIONS: {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    ignoreUndefined: true,
  } satisfies MongoClientOptions,
  EMAIL_ACTION_URL: `${env.APP_URL}/magic`,
}
