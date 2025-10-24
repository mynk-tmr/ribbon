import { Hono } from 'hono'
import { query } from '../utils/query'

export const tmdbApp = new Hono()

tmdbApp.get('*', async (c) => {
  const path = c.req.url.split('/tmdb/').at(-1)
  if (!path) return c.text('Missing path', 401)
  const res = await query(path)
  return c.json(res)
})
