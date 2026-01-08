import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { connect } from '../../services/mongodb.service'
import { searchAddInputSchema } from './search.dto'
import {
  addSearch,
  clearAllSearches,
  deleteSearch,
  getAllSearches,
  SearchError,
} from './search.service'

export async function getAllSearchesController(c: Context) {
  await connect()
  const uid = c.get('uid')

  const searches = await getAllSearches(uid)
  return c.json(searches)
}

export async function addSearchController(c: Context) {
  await connect()
  const uid = c.get('uid')

  const body = await c.req.json()
  const input = searchAddInputSchema.assert(body)

  try {
    const search = await addSearch(uid, input)
    return c.json(search, 201)
  } catch (error) {
    if (error instanceof SearchError) {
      throw new HTTPException(500, { message: error.code })
    }
    throw error
  }
}

export async function deleteSearchController(c: Context) {
  await connect()
  const uid = c.get('uid')
  const id = c.req.param('id')

  try {
    await deleteSearch(uid, id)
    return c.json({ success: true })
  } catch (error) {
    if (error instanceof SearchError) {
      throw new HTTPException(404, { message: error.code })
    }
    throw error
  }
}

export async function clearAllSearchesController(c: Context) {
  await connect()
  const uid = c.get('uid')

  await clearAllSearches(uid)
  return c.json({ success: true })
}
