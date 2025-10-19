import { MongoClient, ObjectId } from 'mongodb'
import { ENV } from './dotenv'

const client = new MongoClient(ENV.MONGO_URI, {
  ignoreUndefined: true,
}).once('open', () => console.log('Connected to MongoDB'))

export const db = client.db(ENV.DB_NAME)

export interface UserEntity {
  fullname: string
  email: string
  emailVerified: boolean
  avatar: string
  passwordHash: string
  createdAt: Date
}

export interface MediaEntity {
  userId: ObjectId
  type: 'movie' | 'tv' | 'episode'
  tmdbId: number
  title: string
  posterPath: string | null
  isFavorite: boolean
  watchlist?: {
    progress: number
    addedAt: Date
    finishedAt: Date | null
  }
  rating: number
  createdAt: Date
}

export const users = db.collection<UserEntity>('users')
export const media = db.collection<MediaEntity>('media')

export async function initDB() {
  await users.createIndex(
    { email: 1 },
    { unique: true, partialFilterExpression: { emailVerified: true } },
  )

  await users.createIndex(
    { 'sessions.token': 1 },
    { unique: true, sparse: true },
  )

  await media.createIndex({ userId: 1, tmdbId: 1 }, { unique: true })
  console.log('✅ Indexes ensured')
}

export async function failIfAbsent<T>(
  obj: Promise<T | null | undefined>,
  failMessage: string,
): Promise<T> {
  const res = await obj
  if (!res) throw new Error(failMessage, { cause: 'app' })
  return res
}

export async function failIfPresent<T>(
  obj: Promise<T | null | undefined>,
  failMessage: string,
): Promise<void> {
  const res = await obj
  if (res) throw new Error(failMessage, { cause: 'app' })
}
