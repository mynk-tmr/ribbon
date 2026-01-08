// API Store - Replaces idb-store.ts with MongoDB backend API calls
import { ofetch } from 'ofetch'
import type { AuthUser, LoginInput, RegisterInput } from '@/dtos/auth.dto'
import type {
  MediaAddInput,
  MediaItem,
  MediaProgressInput,
  MediaStatusInput,
} from '@/dtos/media.dto'
import type { SearchAddInput, SearchItem } from '@/dtos/search.dto'
import { authStoreActions } from '@/shared/hooks/useAuth'
import { mediaStore } from './media.store'
import { searchStore } from './search.store'

const API_BASE = '/api'

// Create ofetch instance with credentials for JWT cookies
const api = ofetch.create({ baseURL: API_BASE, credentials: 'include' })

// Server error codes mapping
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

// Error handling
export class APIError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// Helper to get user-friendly error message
function getErrorMessage(code: string, serverMessage?: string): string {
  return ERROR_MESSAGES[code] || serverMessage || ERROR_MESSAGES.UNKNOWN_ERROR
}

// Helper to handle errors
async function handleRequest<T>(request: Promise<T>): Promise<T> {
  try {
    return await request
  } catch (error) {
    // ofetch includes response data in error object
    if (error && typeof error === 'object') {
      // Try to get data from the error
      const errorObj = error as {
        data?: unknown
        response?: { _data?: unknown }
      }

      // First try: data property
      let errorData = errorObj.data as
        | { error?: { code?: string; message?: string } }
        | undefined

      // Second try: response._data property
      if (!errorData && errorObj.response?._data) {
        errorData = errorObj.response._data as {
          error?: { code?: string; message?: string }
        }
      }

      if (errorData?.error) {
        const code = errorData.error.code || 'UNKNOWN_ERROR'
        const message = getErrorMessage(code, errorData.error.message)
        throw new APIError(code, message)
      }
    }

    // Unknown error
    throw new APIError('UNKNOWN_ERROR', ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

// Auth API
export const AuthAPI = {
  async register(input: RegisterInput): Promise<AuthUser> {
    const result = await handleRequest(
      api<AuthUser>('/auth/register', { method: 'POST', body: input }),
    )
    await authStoreActions.refresh()
    return result
  },

  async login(input: LoginInput): Promise<AuthUser> {
    const result = await handleRequest(
      api<AuthUser>('/auth/login', { method: 'POST', body: input }),
    )
    await authStoreActions.refresh()
    return result
  },

  async logout(): Promise<{ success: boolean }> {
    const result = await handleRequest(
      api<{ success: boolean }>('/auth/logout', { method: 'POST' }),
    )
    await authStoreActions.refresh()
    return result
  },

  async me(): Promise<AuthUser> {
    return handleRequest(api<AuthUser>('/auth/me'))
  },

  async check(): Promise<AuthUser | null> {
    try {
      return await this.me()
    } catch {
      return null
    }
  },
}

// Media API
export const MediaAPI = {
  async getAll(): Promise<MediaItem[]> {
    return handleRequest(api<MediaItem[]>('/media'))
  },

  async add(input: MediaAddInput): Promise<MediaItem> {
    return handleRequest(
      api<MediaItem>('/media', { method: 'POST', body: input }),
    )
  },

  async remove(tmdbId: number): Promise<{ success: boolean }> {
    return handleRequest(
      api<{ success: boolean }>(`/media/${tmdbId}`, { method: 'DELETE' }),
    )
  },

  async updateStatus(
    tmdbId: number,
    input: MediaStatusInput,
  ): Promise<{ success: boolean }> {
    return handleRequest(
      api<{ success: boolean }>(`/media/${tmdbId}/status`, {
        method: 'PATCH',
        body: input,
      }),
    )
  },

  async updateProgress(
    tmdbId: number,
    input: MediaProgressInput,
  ): Promise<{ success: boolean }> {
    return handleRequest(
      api<{ success: boolean }>(`/media/${tmdbId}/progress`, {
        method: 'PUT',
        body: input,
      }),
    )
  },
}

// Search API
export const SearchAPI = {
  async getAll(): Promise<SearchItem[]> {
    return handleRequest(api<SearchItem[]>('/search'))
  },

  async add(input: SearchAddInput): Promise<SearchItem> {
    return handleRequest(
      api<SearchItem>('/search', { method: 'POST', body: input }),
    )
  },

  async remove(id: string): Promise<{ success: boolean }> {
    return handleRequest(
      api<{ success: boolean }>(`/search/${id}`, { method: 'DELETE' }),
    )
  },

  async clear(): Promise<{ success: boolean }> {
    return handleRequest(
      api<{ success: boolean }>('/search', { method: 'DELETE' }),
    )
  },
}

// Passwordless API
export const PasswordlessAPI = {
  async sendLoginLink(email: string): Promise<{ success: boolean }> {
    return handleRequest(
      api<{ success: boolean }>('/passwordless/send-login', {
        method: 'POST',
        body: { email },
      }),
    )
  },

  async sendPasswordReset(email: string): Promise<{ success: boolean }> {
    return handleRequest(
      api<{ success: boolean }>('/passwordless/send-reset', {
        method: 'POST',
        body: { email },
      }),
    )
  },

  async verifyToken(token: string): Promise<AuthUser> {
    const result = await handleRequest(
      api<AuthUser>('/passwordless/verify', {
        method: 'POST',
        body: { token },
      }),
    )
    await authStoreActions.refresh()
    return result
  },
}

// Migration: Clear old IndexedDB databases
async function clearOldIndexedDB(): Promise<void> {
  const databases = await indexedDB.databases()
  for (const db of databases) {
    if (db.name?.startsWith('appdb-v0-')) {
      indexedDB.deleteDatabase(db.name)
    }
  }
}

// Initialize app with migration
export async function initializeApp(): Promise<void> {
  // Clear old IndexedDB on first load after migration
  if (!localStorage.getItem('migrated-to-mongodb')) {
    await clearOldIndexedDB()
    localStorage.setItem('migrated-to-mongodb', 'true')
  }

  // Check auth state
  await authStoreActions.refresh()
  await mediaStore.refresh()
  await searchStore.refresh()
}

// Export all APIs as a single object
export const API = {
  auth: AuthAPI,
  media: MediaAPI,
  search: SearchAPI,
  initializeApp,
}
