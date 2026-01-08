# Clean Architecture Refactoring Design

**Date:** 2026-01-09
**Author:** Claude Sonnet
**Status:** Draft

## Overview

Refactor the frontend `src/` folder into clean architecture with simplified 2-layer structure, remove unused TMDB types, and establish scalable patterns for future development.

**Goals:**
- Organize code into clear layers with单向 dependency flow
- Remove unused types from TMDB schema
- Maintain TanStack Router file-based routing
- Keep current backend (IndexedDB + Firebase Auth)
- Enable future MongoDB migration with minimal UI changes

**Non-Goals:**
- Backend changes (IndexedDB, Firebase remain)
- TanStack Router replacement
- External API changes

## Architecture

### Layer Structure

```
src/
├── domain/              # Layer 1: Core business logic (no framework dependencies)
│   ├── entities/        # Core types and interfaces
│   └── repositories/    # Data access interfaces
│
├── application/         # Layer 2: Implementation details
│   ├── api/             # External API clients (TMDB, Firebase, IDB)
│   ├── stores/          # State management (nanostores)
│   └── services/        # Service implementations
│
├── components/          # Reusable UI components (route-agnostic)
│   ├── ui/              # Pure UI components
│   ├── features/        # Feature-specific components
│   └── layout/          # Layout components
│
├── routes/              # TanStack Router pages (file-based routing)
│   ├── __root.tsx
│   ├── index.tsx
│   ├── auth/
│   ├── details.$media.$id/
│   └── ...
│
├── shared/              # Cross-cutting concerns
│   ├── config/          # App configuration
│   ├── utils/           # Pure utility functions
│   └── hooks/           # Custom React hooks
│
└── main.tsx             # App entry point
```

### Dependency Rule

**Dependency Flow:** Routes → Application → Domain

```
┌─────────────┐
│   Routes    │ ──┐
└─────────────┘   │
                  ▼
┌─────────────────────────────────────┐
│         Application Layer           │
│  (API clients, stores, services)    │
└─────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│          Domain Layer               │
│    (entities, repositories)         │
└─────────────────────────────────────┘
```

- **Domain** has zero dependencies on frameworks
- **Application** implements domain interfaces
- **Routes/Components** use application services
- **No reverse dependencies** (Presentation never imports Domain directly)

## Domain Layer

### Purpose
Pure TypeScript types and interfaces - zero framework dependencies.

### Structure

```
domain/
├── entities/
│   ├── media.entity.ts          # MediaItem, Season, Episode, etc.
│   ├── user.entity.ts           # User, AuthUser, UserProfile
│   ├── search.entity.ts         # SearchItem, SearchHistory
│   └── tmdb.entity.ts           # Audited TMDB types (only what's used)
│
└── repositories/
    ├── auth.repository.ts       # Interface for auth operations
    ├── media.repository.ts      # Interface for media CRUD
    └── search.repository.ts     # Interface for search history
```

### Key Changes

**1. Extract from `config/+tmdb.types.ts`:**
- Only keep types actually used in codebase
- Move to `domain/entities/tmdb.entity.ts`
- Likely candidates to keep:
  - `Media`, `Paginated<T>`, `MovieDetail`, `TVDetail`
  - `Season`, `Episode`, `Person`, `PersonDetails`
  - `Image` (if used for image collections)

**2. New entity files** (currently in `config/idb-store.ts`):

```typescript
// domain/entities/media.entity.ts
export type MediaStatus = 'completed' | 'watching'

export interface MediaItem {
  id: number
  title: string
  media_type: 'movie' | 'tv'
  progress: number        // 0-100
  timestamp: number       // playback in seconds
  duration: number        // duration in seconds
  season: number
  episode: number
  poster_path: string | null
  status: MediaStatus
}

export interface MediaItemInput {
  id: number
  title: string
  media_type: 'movie' | 'tv'
  poster_path: string | null
  season: number
  episode: number
}
```

```typescript
// domain/entities/search.entity.ts
export type SearchEntity = 'movie' | 'tv' | 'person'

export interface SearchItem {
  id: string
  query: string
  entity: SearchEntity
  addedAt: Date
}
```

**3. Repository interfaces:**

```typescript
// domain/repositories/media.repository.ts
import type { MediaItem, MediaItemInput, MediaStatus } from '../entities/media.entity'

export interface IMediaRepository {
  getAll(): Promise<MediaItem[]>
  add(item: MediaItemInput): Promise<void>
  remove(id: number): Promise<void>
  updateStatus(id: number, status: MediaStatus): Promise<void>
}
```

```typescript
// domain/repositories/search.repository.ts
import type { SearchItem, SearchEntity } from '../entities/search.entity'

export interface ISearchRepository {
  getAll(): Promise<SearchItem[]>
  add(query: string, entity: SearchEntity): Promise<void>
  remove(id: string): Promise<void>
  clear(): Promise<void>
}
```

```typescript
// domain/repositories/auth.repository.ts
export interface IAuthRepository {
  getCurrentUser(): Promise<User | null>
  signIn(email: string, password: string): Promise<User>
  signUp(email: string, password: string): Promise<User>
  signOut(): Promise<void>
  onAuthStateChanged(callback: (user: User | null) => void): () => void
}
```

## Application Layer

### Purpose
Implements domain interfaces, manages state, handles external APIs.

### Structure

```
application/
├── api/
│   ├── tmdb/
│   │   ├── tmdb.client.ts      # TMDB API wrapper
│   │   └── normalise.ts        # Data normalization
│   │
│   ├── idb/
│   │   ├── idb.client.ts       # IndexedDB connection
│   │   └── idb.schema.ts       # DB schema
│   │
│   └── firebase/
│       ├── firebase.client.ts  # Firebase instance
│       └── firebase.config.ts  # Config
│
├── stores/
│   ├── auth.store.ts           # Auth state
│   ├── media.store.ts          # Media list state
│   └── search.store.ts         # Search history state
│
└── services/
    ├── auth.service.ts         # Implements IAuthRepository
    ├── media.service.ts        # Implements IMediaRepository
    └── search.service.ts       # Implements ISearchRepository
```

### Key Refactorings

**1. Move `config/tmdb.ts` → `application/api/tmdb/tmdb.client.ts`:**
- Pure API client, no state
- Exports `tmdb` object with typed methods
- Normalise function moved to `normalise.ts`

**2. Split `config/idb-store.ts` into:**

```typescript
// application/api/idb/idb.client.ts
import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

interface MyDB extends DBSchema {
  media: { key: number; value: MediaItem }
  search: { key: string; value: SearchItem }
}

let db: IDBPDatabase<MyDB> | undefined

export async function getDb(uid: string): Promise<IDBPDatabase<MyDB>> {
  if (db) return db

  const dbName = `appdb-v0-${uid}`
  db = await openDB<MyDB>(dbName, 1, {
    upgrade(db) {
      db.createObjectStore('media', { keyPath: 'id' })
      db.createObjectStore('search', { keyPath: 'id' })
    },
  })

  return db
}

export function closeDb(): void {
  db?.close()
  db = undefined
}
```

```typescript
// application/stores/media.store.ts
import { atom } from 'nanostores'
import { getDb } from '../api/idb/idb.client'
import type { MediaItem, MediaItemInput, MediaStatus } from '@/domain/entities/media.entity'

const $media = atom<MediaItem[]>([])

export const mediaStore = {
  store: $media,

  async refresh(): Promise<void> {
    const uid = 'guest' // TODO: Get from auth
    const db = await getDb(uid)
    const items = await db.getAll('media')
    $media.set(items)
  },

  async add(item: MediaItemInput): Promise<void> {
    const uid = 'guest'
    const db = await getDb(uid)
    await db.put('media', {
      ...item,
      duration: 0,
      timestamp: 0,
      progress: 0,
      status: 'watching',
    })
    await this.refresh()
  },

  async remove(id: number): Promise<void> {
    const uid = 'guest'
    const db = await getDb(uid)
    await db.delete('media', id)
    await this.refresh()
  },

  async updateStatus(id: number, status: MediaStatus): Promise<void> {
    const uid = 'guest'
    const db = await getDb(uid)
    const media = await db.get('media', id)
    if (!media) return
    await db.put('media', { ...media, status })
    await this.refresh()
  },
}
```

**3. Move `hooks/useFireAuth.ts` → `application/stores/auth.store.ts`:**

```typescript
// application/stores/auth.store.ts
import { atom } from 'nanostores'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { firebaseAuth } from '../api/firebase/firebase.client'

type AuthState = { loading: boolean; user: User | null }

export const authStore = atom<AuthState>({ loading: true, user: null })

onAuthStateChanged(firebaseAuth, (user) => {
  authStore.set({ loading: false, user })
})

export const authStoreActions = {
  refresh: async () => {
    await firebaseAuth.currentUser?.reload()
    authStore.set({ loading: false, user: firebaseAuth.currentUser })
  },
}
```

Keep adapter hook in `shared/hooks/useAuth.ts`:
```typescript
import { useStore } from '@nanostores/react'
import { authStore } from '@/application/stores/auth.store'

export function useAuth() {
  return useStore(authStore)
}
```

**4. Services implement repository interfaces:**

```typescript
// application/services/media.service.ts
import type { IMediaRepository } from '@/domain/repositories/media.repository'
import { mediaStore } from '@/application/stores/media.store'

export const mediaService: IMediaRepository = {
  getAll: () => mediaStore.refresh().then(() => {
    // Return current value
    return mediaStore.store.value || []
  }),
  add: (item) => mediaStore.add(item),
  remove: (id) => mediaStore.remove(id),
  updateStatus: (id, status) => mediaStore.updateStatus(id, status),
}
```

## Presentation Layer

### Purpose
Renders UI using services from application layer.

### Structure

```
components/
├── ui/                  # Pure UI components
│   ├── base-entity-card.tsx
│   ├── poster.tsx
│   ├── rating-circle.tsx
│   ├── meta-item.tsx
│   └── ...
│
├── features/            # Feature-specific components
│   ├── auth-guard.tsx
│   ├── add-media.tsx
│   ├── change-status.tsx
│   ├── card-media-item.tsx
│   ├── episode.tsx
│   ├── overview.tsx
│   ├── search-history.tsx
│   └── ...
│
└── layout/              # Layout components
    ├── app-new-header.tsx
    ├── big-divider.tsx
    ├── scroll-to-top.tsx
    └── top-loading.tsx

routes/                  # TanStack Router (unchanged location)
├── __root.tsx
├── index.tsx
├── auth/
├── details.$media.$id/
└── ...
```

### Key Changes

**1. Components stop accessing stores directly:**

```typescript
// Before
import { MyMedias } from '@/config/idb-store.ts'

// After
import { mediaService } from '@/application/services/media.service'
```

**2. Route loaders use services:**

```typescript
// routes/details.$media.$id/route.tsx
import { createFileRoute } from '@tanstack/react-router'
import { tmdb } from '@/application/api/tmdb/tmdb.client'
import { mediaService } from '@/application/services/media.service'

export const Route = createFileRoute('/details/$media/$id')({
  async loader({ params: { media, id } }) {
    const details = await tmdb.details(media, id)
    const userMedia = await mediaService.getAll()
    return { details, userMedia }
  },
})
```

**3. Components receive data via props:**
- No direct store imports in components
- Route components fetch data via services
- Child components receive data as props

## Shared Layer

### Purpose
Cross-cutting utilities and configuration.

### Structure

```
shared/
├── config/
│   ├── theme.ts           # Mantine theme (unchanged)
│   └── constants.ts       # App constants (if any)
│
├── utils/
│   ├── cn.ts              # Class name utils (unchanged)
│   ├── formatters.ts      # Date, number formatters (unchanged)
│   └── pretty-firebase-error.ts  # Error formatting (unchanged)
│
└── hooks/
    ├── useFormAction.ts   # Keep existing hooks (unchanged)
    ├── useFireBaseAction.ts
    ├── useMergedState.ts
    └── useAuth.ts         # New: auth adapter hook
```

**Minimal changes** - mostly organizing existing files.

## Type Cleanup Strategy

### Audit `config/+tmdb.types.ts`

**Step 1: Scan codebase for usage**
- Grep all route files and components for TMDB type imports
- Identify which types are actually referenced

**Step 2: Remove unused types**

Based on codebase analysis, likely **USED** types:
- `Media` - Used throughout
- `Paginated<T>` - Used for API responses
- `MovieDetail`, `TVDetail` - Used in detail pages
- `DetailBase` - Extended by detail types
- `Season`, `Episode` - Used for TV shows
- `Person`, `PersonDetails` - Used in person pages
- `Image` - May be used for image galleries

Likely **UNUSED** types (candidates for removal):
- `SearchParams` - If search uses simple query strings
- `DiscoverParams` - Complex filters if not used in discover UI
- `CombinedCredits` - If person credits not displayed
- `Company`, `Country`, `SpokenLanguage` - Nested details if not shown
- `ImgCollection` - If image galleries not fetched
- `EpisodeDetail`, `SeasonDetail` - If only basic season data used
- `Error` - If not handling TMDB errors explicitly

**Step 3: Create cleaned `tmdb.entity.ts`**

```typescript
// domain/entities/tmdb.entity.ts
export interface Genre {
  id: number
  name: string
}

export interface Media {
  media_type: 'movie' | 'tv' | 'person'
  id: number
  title: string
  release_date: string
  adult: boolean
  genre_ids: number[]
  overview?: string
  popularity: number
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  original_language: string
  character?: string
}

export interface Paginated<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface DetailBase extends Media {
  homepage: string
  genres: Genre[]
  status: string
  tagline: string
}

export interface MovieDetail extends DetailBase {
  budget: number
  imdb_id: string | null
  revenue: number
  runtime: number | null
  origin_country: string[]
}

export interface TVDetail extends DetailBase {
  created_by: Person[]
  episode_run_time: number[]
  first_air_date: string
  last_air_date: string
  networks: Company[]
  number_of_episodes: number
  number_of_seasons: number
  seasons: Season[]
}

export interface Season {
  air_date: string
  episode_count: number
  id: number
  name: string
  overview?: string
  poster_path: string | null
  season_number: number
  vote_average: number
}

export interface Episode {
  id: number
  name: string
  overview: string
  vote_average: number
  vote_count: number
  air_date: string
  episode_number: number
  runtime: number | null
  season_number: number
  still_path: string | null
}

export interface Person {
  media_type: 'person'
  id: number
  name: string
  profile_path: string | null
  known_for: Media[]
  known_for_department: string
  popularity: number
  gender: number
  adult: boolean
}

export interface PersonDetails extends Person {
  biography: string
  birthday: string | null
  deathday: string | null
  homepage: string | null
  place_of_birth: string | null
}

export interface Company {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface Image {
  aspect_ratio: number
  height: number
  file_path: string
  width: number
}
```

## Migration Path

### Phase 1: Create new structure (non-breaking)
1. Create `domain/` folder with entities and repositories
2. Create `application/` folder structure
3. Move and adapt files to new locations
4. Keep old files temporarily with deprecation warnings

### Phase 2: Update imports incrementally
1. Update one route file at a time
2. Update components used by that route
3. Test after each change
4. Use TypeScript to find all import locations

### Phase 3: Remove deprecated files
1. Verify all routes updated
2. Run full test suite
3. Remove old `config/` files
4. Delete `+tmdb.types.ts`

### Phase 4: Type cleanup
1. Audit TMDB type usage
2. Create cleaned `tmdb.entity.ts`
3. Update all imports
4. Remove unused types

## Benefits

**Immediate:**
- Clear separation of concerns
- Easier to find code (feature-based organization)
- Better type safety with repository interfaces
- Reduced coupling between layers

**Long-term:**
- Easy migration path to MongoDB (swap repository implementations)
- Testable business logic (domain layer has no dependencies)
- Scalable architecture for new features
- Onboarding easier for new developers

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Breaking changes during migration | Incremental updates, keep old files temporarily |
| TanStack Router file-based routing conflict | Keep `routes/` at root level |
| TypeScript errors from moved imports | Use IDE refactoring tools, update systematically |
| Regressions from refactoring | Test after each route/component update |

## Next Steps

1. **Review and approve** this design document
2. **Create implementation plan** with detailed tasks
3. **Set up git worktree** for isolated development
4. **Execute migration** phase by phase
5. **Test thoroughly** before merging

## Appendix: File Mapping

### Old → New

| Old Path | New Path |
|----------|----------|
| `config/+tmdb.types.ts` | `domain/entities/tmdb.entity.ts` |
| `config/tmdb.ts` | `application/api/tmdb/tmdb.client.ts` |
| `config/idb-store.ts` | `application/api/idb/idb.client.ts` + `application/stores/*.store.ts` |
| `config/firebase.ts` | `application/api/firebase/firebase.client.ts` |
| `hooks/useFireAuth.ts` | `application/stores/auth.store.ts` |
| `helpers/*` | `shared/utils/*` |
| `hooks/*` | `shared/hooks/*` |
| `config/theme.ts` | `shared/config/theme.ts` |
| `components/*` | `components/{ui,features,layout}/*` |
| `routes/*` | `routes/*` (unchanged) |

### New Files (to create)

- `domain/entities/media.entity.ts`
- `domain/entities/search.entity.ts`
- `domain/entities/user.entity.ts`
- `domain/repositories/auth.repository.ts`
- `domain/repositories/media.repository.ts`
- `domain/repositories/search.repository.ts`
- `application/services/auth.service.ts`
- `application/services/media.service.ts`
- `application/services/search.service.ts`
- `shared/hooks/useAuth.ts`
