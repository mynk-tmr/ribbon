import { MongoClient } from 'mongodb'
import { ENV } from './dotenv'

export const client = new MongoClient(ENV.MONGO_URI)
export const db = client.db(ENV.DB_NAME)
