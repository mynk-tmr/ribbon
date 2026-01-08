# MongoDB Migration Design

## Overview

Migrate from client-side IndexedDB to server-side MongoDB for better data persistence. Users will no longer lose their tracked media and search history when clearing browser cache.

## Goals

- **Primary**: Better data persistence (prevent data loss from browser cache clearing)
- **Auth**: Replace Firebase Auth with JWT + httpOnly cookies
- **Architecture**: Pure API calls (server as source of truth)
- **Migration**: Clean break from IndexedDB (users start fresh)

## Database Schema (BCNF Normalized)

### Functional Dependencies
- `id` + `media_type` → `title`, `poster_path` (TMDB metadata)
- `uid` + `id` + `media_type` → user-specific tracking data

### Collections

**users**
```typescript
{
  _id: ObjectId, // This is the UID
  email: string (indexed, unique),
  passwordHash: string,
  createdAt: Date,
  lastLogin: Date
}
```

**tmdb_metadata** (static TMDB data, shared across users)
```typescript
{
  _id: ObjectId,
  id: number (indexed), // TMDB ID
  media_type: 'movie' | 'tv',
  title: string,
  poster_path: string | null
}
// Compound unique index: { id: 1, media_type: 1 }
```

**user_media** (user-specific tracking only)
```typescript
{
  _id: ObjectId,
  uid: ObjectId (indexed), // FK to users._id
  metadata_id: ObjectId (indexed), // FK to tmdb_metadata._id
  progress: number, // 0-100
  timestamp: number, // playback in seconds
  duration: number,
  season: number,
  episode: number,
  status: 'completed' | 'watching',
  updatedAt: Date
}
// Compound index: { uid: 1, metadata_id: 1 }
```

**search_history**
```typescript
{
  _id: ObjectId,
  uid: ObjectId (indexed), // FK to users._id
  query: string,
  entity: 'movie' | 'tv' | 'person',
  addedAt: Date
}
// Compound index: { uid: 1, addedAt: -1 }
```

## API Routes

### Authentication (`/api/auth`)

- `POST /api/auth/register` - Register new user, returns uid/email
- `POST /api/auth/login` - Login, sets httpOnly cookie with JWT
- `POST /api/auth/logout` - Clear cookie
- `GET /api/auth/me` - Get current user from JWT

### Media (`/api/media`)

- `GET /api/media` - Get all media for authenticated user (with aggregation lookup)
- `POST /api/media` - Add media to user's list
- `DELETE /api/media/:tmdbId` - Remove media
- `PATCH /api/media/:tmdbId/status` - Update status (completed/watching)
- `PUT /api/media/:tmdbId/progress` - Update playback progress

### Search (`/api/search`)

- `GET /api/search` - Get search history (sorted by addedAt desc)
- `POST /api/search` - Add search query (deduplicate if exists)
- `DELETE /api/search/:id` - Delete specific search (by ObjectId)
- `DELETE /api/search` - Clear all searches

## Authentication

- **Password hashing**: `Bun.password.hash(password, 'bcrypt')`
- **Password verify**: `Bun.password.verify(password, hash)`
- **JWT**: Hono's built-in `hono/jwt`
- **Cookie**: httpOnly, secure (prod), sameSite: lax, 7-day expiry
- **Payload**: `{ uid: string, email: string, exp: number }`
- **Middleware**: Validates JWT, attaches `uid` (ObjectId) and `userEmail` to context

## Error Handling

**Error response format:**
```typescript
{
  error: {
    code: string, // e.g., "INVALID_CREDENTIALS", "VALIDATION_ERROR"
    message: string,
    details?: ValidationErrorDetails | Record<string, unknown>
  }
}
```

**Error codes:**
- `INVALID_CREDENTIALS` - Wrong email/password
- `EMAIL_EXISTS` - Registration with duplicate email
- `VALIDATION_ERROR` - Invalid request body (arktype)
- `UNAUTHORIZED` - Missing/invalid JWT
- `NOT_FOUND` - Resource doesn't exist
- `DUPLICATE_ENTRY` - Media/search already exists
- `DATABASE_ERROR` - MongoDB operation failed

## Clean Architecture Structure

### Frontend (`src/`)
```
dtos/
├── auth.dto.ts          # AuthUser, RegisterInput, LoginInput
├── media.dto.ts         # MediaItem, MediaAddInput, etc.
└── search.dto.ts        # SearchItem, SearchAddInput

config/
└── api-store.ts         # Replaces idb-store.ts (API client)

main.tsx                 # App initialization + migration
```

### Server (`server/`)
```
modules/
├── auth/
│   ├── auth.route.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.dto.ts
├── media/
│   ├── media.route.ts
│   ├── media.controller.ts
│   ├── media.service.ts
│   └── media.dto.ts
├── search/
│   ├── search.route.ts
│   ├── search.controller.ts
│   ├── search.service.ts
│   └── search.dto.ts
├── error.handler.ts
└── tmdb.route.ts        # Existing (unchanged)

services/
├── mongodb.service.ts   # Connection singleton, indexes
└── jwt.service.ts       # Sign/verify JWT

middleware/
└── auth.middleware.ts   # JWT validation

utils/
├── dotenv.ts            # ENV validation + CONFIG
└── query.ts             # Existing TMDB util
```

## Environment Variables

**Required (validated via arktype):**
```bash
TMDB_TOKEN=string > 1
VERCEL=boolean
MONGODB_URI=string > 1
JWT_SECRET=string >= 32
```

**Config object:**
```typescript
{
  TMDB_BASE: 'https://api.themoviedb.org/3',
  JWT_EXPIRES_IN: 7 * 24 * 60 * 60,
  COOKIE_OPTIONS: { httpOnly: true, secure: !VERCEL, sameSite: 'Lax', maxAge: 7 days },
  MONGODB_OPTIONS: { maxPoolSize: 10, minPoolSize: 2, ... }
}
```

## Migration Strategy

**Clean break approach:**

1. Deploy new MongoDB backend
2. On first app load, clear all IndexedDB databases matching `appdb-v0-*`
3. Set localStorage flag `migrated-to-mongodb=true`
4. Initialize auth state (`Auth.check()`)
5. Users start fresh with empty data

**Implementation:**
```typescript
// In api-store.ts
async function clearOldIndexedDB(): Promise<void> {
  const databases = await indexedDB.databases()
  for (const db of databases) {
    if (db.name?.startsWith('appdb-v0-')) {
      indexedDB.deleteDatabase(db.name)
    }
  }
}

export async function initializeApp(): Promise<void> {
  if (!localStorage.getItem('migrated-to-mongodb')) {
    await clearOldIndexedDB()
    localStorage.setItem('migrated-to-mongodb', 'true')
  }
  await Auth.check()
}
```

## Dependencies

**Add:**
```json
{
  "dependencies": {
    "mongodb": "^7"
  }
}
```

**Remove:**
- `idb` package (from frontend)
- Firebase Auth (keep only email service if needed)

**Existing (used):**
- `hono/jwt` (built-in with Hono)
- `arktype` (validation)
- `ofetch` (API client)

## Key Implementation Details

1. **MongoDB ObjectId for UID**: Using `_id` as user identifier (not UUID string)
2. **JWT in httpOnly cookies**: Not accessible via JS, more secure than localStorage
3. **Aggregation for media**: Use `$lookup` to join user_media with tmdb_metadata
4. **Arktype validation**: All request bodies validated before processing
5. **Bun runtime**: Using `Bun.password` instead of bcrypt package
6. **Connection pooling**: MongoDB service manages singleton connection with indexes
7. **Graceful shutdown**: Handle SIGTERM/SIGINT to close MongoDB connection

## Benefits

- Data persists across devices and browsers
- Clean architecture with separation of concerns
- Type-safe API layer with DTOs
- Better security (httpOnly cookies, proper password hashing)
- Foundation for future multi-user features (sharing, social, etc.)
- BCNF normalized schema eliminates redundancy
