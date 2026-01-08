import { ObjectId } from 'mongodb'
import { getCollections } from '../../services/mongodb.service'
import type {
  MediaAddInput,
  MediaItem,
  MediaProgressInput,
  MediaStatusInput,
} from './media.dto'

export class MediaError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message)
    this.name = 'MediaError'
  }
}

export async function getAllMedia(uid: string): Promise<MediaItem[]> {
  const { user_media } = getCollections()

  const pipeline = [
    { $match: { uid: new ObjectId(uid) } },
    {
      $lookup: {
        from: 'tmdb_metadata',
        localField: 'metadata_id',
        foreignField: '_id',
        as: 'metadata',
      },
    },
    { $unwind: '$metadata' },
    {
      $project: {
        _id: 1,
        uid: 1,
        metadata_id: 1,
        progress: 1,
        timestamp: 1,
        duration: 1,
        season: 1,
        episode: 1,
        status: 1,
        updatedAt: 1,
        id: '$metadata.id',
        media_type: '$metadata.media_type',
        title: '$metadata.title',
        poster_path: '$metadata.poster_path',
      },
    },
  ]

  const result = await user_media.aggregate(pipeline).toArray()
  return result as MediaItem[]
}

export async function addMedia(
  uid: string,
  input: MediaAddInput,
): Promise<MediaItem> {
  const { user_media, tmdb_metadata } = getCollections()

  // Check if TMDB metadata exists, if not create it
  let metadataDoc = await tmdb_metadata.findOne({
    id: input.id,
    media_type: input.media_type,
  })

  if (!metadataDoc) {
    const result = await tmdb_metadata.insertOne({
      id: input.id,
      media_type: input.media_type,
      title: input.title,
      poster_path: input.poster_path,
    })
    metadataDoc = { _id: result.insertedId }
  }

  // Check if user already has this media
  const existingMedia = await user_media.findOne({
    uid: new ObjectId(uid),
    metadata_id: metadataDoc._id,
  })

  if (existingMedia) {
    throw new MediaError('DUPLICATE_ENTRY', 'Media already in your list')
  }

  // Add to user's media list
  const result = await user_media.insertOne({
    uid: new ObjectId(uid),
    metadata_id: metadataDoc._id,
    progress: 0,
    timestamp: 0,
    duration: 0,
    season: null,
    episode: null,
    status: 'watching',
    updatedAt: new Date(),
  })

  // Fetch the created media with metadata
  const createdMedia = await user_media
    .aggregate([
      { $match: { _id: result.insertedId } },
      {
        $lookup: {
          from: 'tmdb_metadata',
          localField: 'metadata_id',
          foreignField: '_id',
          as: 'metadata',
        },
      },
      { $unwind: '$metadata' },
      {
        $project: {
          _id: 1,
          uid: 1,
          metadata_id: 1,
          progress: 1,
          timestamp: 1,
          duration: 1,
          season: 1,
          episode: 1,
          status: 1,
          updatedAt: 1,
          id: '$metadata.id',
          media_type: '$metadata.media_type',
          title: '$metadata.title',
          poster_path: '$metadata.poster_path',
        },
      },
    ])
    .toArray()

  return createdMedia[0] as MediaItem
}

export async function removeMedia(uid: string, tmdbId: number): Promise<void> {
  const { user_media, tmdb_metadata } = getCollections()

  // Find the metadata document
  const metadataDoc = await tmdb_metadata.findOne({ id: tmdbId })
  if (!metadataDoc) {
    throw new MediaError('NOT_FOUND', 'Media not found')
  }

  // Delete user's media
  const result = await user_media.deleteOne({
    uid: new ObjectId(uid),
    metadata_id: metadataDoc._id,
  })

  if (result.deletedCount === 0) {
    throw new MediaError('NOT_FOUND', 'Media not found in your list')
  }
}

export async function updateStatus(
  uid: string,
  tmdbId: number,
  input: MediaStatusInput,
): Promise<void> {
  const { user_media, tmdb_metadata } = getCollections()

  // Find the metadata document
  const metadataDoc = await tmdb_metadata.findOne({ id: tmdbId })
  if (!metadataDoc) {
    throw new MediaError('NOT_FOUND', 'Media not found')
  }

  // Update status
  const result = await user_media.updateOne(
    { uid: new ObjectId(uid), metadata_id: metadataDoc._id },
    { $set: { status: input.status, updatedAt: new Date() } },
  )

  if (result.matchedCount === 0) {
    throw new MediaError('NOT_FOUND', 'Media not found in your list')
  }
}

export async function updateProgress(
  uid: string,
  tmdbId: number,
  input: MediaProgressInput,
): Promise<void> {
  const { user_media, tmdb_metadata } = getCollections()

  // Find the metadata document
  const metadataDoc = await tmdb_metadata.findOne({ id: tmdbId })
  if (!metadataDoc) {
    throw new MediaError('NOT_FOUND', 'Media not found')
  }

  // Update progress
  const result = await user_media.updateOne(
    { uid: new ObjectId(uid), metadata_id: metadataDoc._id },
    {
      $set: {
        progress: input.progress,
        timestamp: input.timestamp,
        duration: input.duration,
        season: input.season,
        episode: input.episode,
        updatedAt: new Date(),
      },
    },
  )

  if (result.matchedCount === 0) {
    throw new MediaError('NOT_FOUND', 'Media not found in your list')
  }
}
