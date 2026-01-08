import { ObjectId } from 'mongodb'
import { getCollections } from '../../services/mongodb.service'
import type { SearchAddInput, SearchItem } from './search.dto'

export class SearchError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message)
    this.name = 'SearchError'
  }
}

export async function getAllSearches(uid: string): Promise<SearchItem[]> {
  const { search_history } = getCollections()

  const searches = await search_history
    .find({ uid: new ObjectId(uid) })
    .sort({ addedAt: -1 })
    .toArray()

  return searches as unknown as SearchItem[]
}

export async function addSearch(
  uid: string,
  input: SearchAddInput,
): Promise<SearchItem> {
  const { search_history } = getCollections()

  // Check if search already exists (deduplicate)
  const existingSearch = await search_history.findOne({
    uid: new ObjectId(uid),
    query: input.query,
    entity: input.entity,
  })

  if (existingSearch) {
    // Update addedAt if exists
    await search_history.updateOne(
      { _id: existingSearch._id },
      { $set: { addedAt: new Date() } },
    )
    return { ...existingSearch, addedAt: new Date() } as unknown as SearchItem
  }

  // Create new search
  const result = await search_history.insertOne({
    uid: new ObjectId(uid),
    query: input.query,
    entity: input.entity,
    addedAt: new Date(),
  })

  const createdSearch = await search_history.findOne({ _id: result.insertedId })
  if (!createdSearch) {
    throw new SearchError('DATABASE_ERROR', 'Failed to create search')
  }

  return createdSearch as unknown as SearchItem
}

export async function deleteSearch(uid: string, id: string): Promise<void> {
  const { search_history } = getCollections()

  const result = await search_history.deleteOne({
    _id: new ObjectId(id),
    uid: new ObjectId(uid),
  })

  if (result.deletedCount === 0) {
    throw new SearchError('NOT_FOUND', 'Search not found')
  }
}

export async function clearAllSearches(uid: string): Promise<void> {
  const { search_history } = getCollections()

  await search_history.deleteMany({ uid: new ObjectId(uid) })
}
