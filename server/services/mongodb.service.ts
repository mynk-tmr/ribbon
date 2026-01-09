import { type Collection, type Db, MongoClient } from 'mongodb'
import { ENV } from '../utils/dotenv'

const client = new MongoClient(ENV.MONGODB_URI, ENV.MONGODB_OPTIONS)
const db = client.db()

export interface Collections {
  users: Collection
  tmdb_metadata: Collection
  user_media: Collection
  search_history: Collection
}

export async function connect(): Promise<Db> {
  await client.connect()
  return db
}

// biome-ignore lint/correctness/noUnusedVariables: <>
async function createIndexes(database: Db): Promise<void> {
  // Users collection
  const users = database.collection('users')
  await users.createIndex({ email: 1 }, { unique: true })

  // TMDB metadata collection
  const tmdbMetadata = database.collection('tmdb_metadata')
  await tmdbMetadata.createIndex({ id: 1, media_type: 1 }, { unique: true })

  // User media collection
  const userMedia = database.collection('user_media')
  await userMedia.createIndex({ uid: 1 })
  await userMedia.createIndex({ uid: 1, metadata_id: 1 })

  // Search history collection
  const searchHistory = database.collection('search_history')
  await searchHistory.createIndex({ uid: 1 })
  await searchHistory.createIndex({ uid: 1, addedAt: -1 })
}

export function getCollections(): Collections {
  return {
    users: db.collection('users'),
    tmdb_metadata: db.collection('tmdb_metadata'),
    user_media: db.collection('user_media'),
    search_history: db.collection('search_history'),
  }
}

export async function closeConnection(): Promise<void> {
  await client.close()
}
