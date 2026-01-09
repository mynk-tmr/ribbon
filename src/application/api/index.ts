import { authStore } from '../stores/auth.store'
import { AuthAPI } from './auth-api'
import { MediaAPI } from './media-api'
import { PasswordlessAPI } from './passwordless-api'
import { SearchAPI } from './search-api'

async function clearOldIndexedDB(): Promise<void> {
  const databases = await indexedDB.databases()
  for (const db of databases) {
    if (db.name?.startsWith('appdb-')) {
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
  await authStore.refresh()
}

// Export all APIs as a single object
export const API = {
  auth: AuthAPI,
  media: MediaAPI,
  search: SearchAPI,
  passwordLess: PasswordlessAPI,
  initializeApp,
}
