import type { ErrorHandler } from 'hono'

export const errorhandler: ErrorHandler = async (err, c) => {
  //@ts-expect-error
  const status = err.status || 500
  return c.json(err, status)
}
