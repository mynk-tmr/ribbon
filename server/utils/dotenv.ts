import { type } from 'arktype'

const scheme = type({
  TMDB_TOKEN: 'string > 1',
  VERCEL: type('string.integer.parse').pipe(Boolean),
  MONGODB_URI: 'string > 1',
  JWT_SECRET: 'string >= 32',
})

const env = scheme.assert(process.env)

export const ENV = {
  ...env,
  TMDB_BASE: 'https://api.themoviedb.org/3',
  JWT_EXPIRES_IN: 7 * 24 * 60 * 60, // 7 days in seconds
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
  },
}
