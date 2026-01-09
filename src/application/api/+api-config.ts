import { ofetch } from 'ofetch'

/** * 1. Error Mapping
 */
const ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'Email already registered',
  VALIDATION_ERROR: 'Invalid input data',
  UNAUTHORIZED: 'Authentication required',
  NOT_FOUND: 'Resource not found',
  DUPLICATE_ENTRY: 'Item already exists',
  DATABASE_ERROR: 'Database error occurred',
  UNKNOWN_ERROR: 'An unknown error occurred',
}

/** * 2. Custom Error Class
 */
export class APIError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message)
    this.name = 'APIError'
  }
}

/** * 3. Specialized ofetch Instance
 */
export const api = ofetch.create({
  baseURL: '/api',
  credentials: 'include',

  // This interceptor handles all non-2xx responses automatically
  onResponseError({ response }) {
    const errorData = response._data?.error

    const code = errorData?.code || 'UNKNOWN_ERROR'
    const message =
      ERROR_MESSAGES[code] || errorData?.message || ERROR_MESSAGES.UNKNOWN_ERROR

    throw new APIError(code, message)
  },

  onRequestError() {
    throw new APIError('NETWORK_ERROR', 'Check your internet connection')
  },
})
