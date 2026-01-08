import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { connect } from '../../services/mongodb.service'
import {
  mediaAddInputSchema,
  mediaProgressInputSchema,
  mediaStatusInputSchema,
} from './media.dto'
import {
  addMedia,
  getAllMedia,
  MediaError,
  removeMedia,
  updateProgress,
  updateStatus,
} from './media.service'

export async function getAllMediaController(c: Context) {
  await connect()
  const uid = c.get('uid')

  const media = await getAllMedia(uid)
  return c.json(media)
}

export async function addMediaController(c: Context) {
  await connect()
  const uid = c.get('uid')

  const body = await c.req.json()
  const input = mediaAddInputSchema.assert(body)

  try {
    const media = await addMedia(uid, input)
    return c.json(media, 201)
  } catch (error) {
    if (error instanceof MediaError) {
      throw new HTTPException(400, { message: error.code })
    }
    throw error
  }
}

export async function removeMediaController(c: Context) {
  await connect()
  const uid = c.get('uid')
  const tmdbId = parseInt(c.req.param('tmdbId'), 10)

  if (Number.isNaN(tmdbId)) {
    throw new HTTPException(400, { message: 'VALIDATION_ERROR' })
  }

  try {
    await removeMedia(uid, tmdbId)
    return c.json({ success: true })
  } catch (error) {
    if (error instanceof MediaError) {
      throw new HTTPException(404, { message: error.code })
    }
    throw error
  }
}

export async function updateStatusController(c: Context) {
  await connect()
  const uid = c.get('uid')
  const tmdbId = parseInt(c.req.param('tmdbId'), 10)

  if (Number.isNaN(tmdbId)) {
    throw new HTTPException(400, { message: 'VALIDATION_ERROR' })
  }

  const body = await c.req.json()
  const input = mediaStatusInputSchema.assert(body)

  try {
    await updateStatus(uid, tmdbId, input)
    return c.json({ success: true })
  } catch (error) {
    if (error instanceof MediaError) {
      throw new HTTPException(404, { message: error.code })
    }
    throw error
  }
}

export async function updateProgressController(c: Context) {
  await connect()
  const uid = c.get('uid')
  const tmdbId = parseInt(c.req.param('tmdbId'), 10)

  if (Number.isNaN(tmdbId)) {
    throw new HTTPException(400, { message: 'VALIDATION_ERROR' })
  }

  const body = await c.req.json()
  const input = mediaProgressInputSchema.assert(body)

  try {
    await updateProgress(uid, tmdbId, input)
    return c.json({ success: true })
  } catch (error) {
    if (error instanceof MediaError) {
      throw new HTTPException(404, { message: error.code })
    }
    throw error
  }
}
