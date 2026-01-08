import type { ErrorHandler } from 'hono'

export const errorhandler: ErrorHandler = async (err, c) => {
  //@ts-expect-error
  const status = err.status || 500
  if (status === 500) {
    console.error(err)
  }

  // Format error response consistently
  const errorCode = err.message || 'UNKNOWN_ERROR'
  return c.json(
    { error: { code: errorCode, message: err.message || errorCode } },
    status,
  )
}
