import type { User } from 'firebase/auth'
import { createContext, use, useActionState } from 'react'
import { prettifyFireAuthErrors } from './utils'

export type AuthCtx = { user: User | null; loading: boolean }

export const AuthContext = createContext<AuthCtx | null>(null)

export function useAuth() {
  const ctx = use(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within a AuthProvider')
  return ctx
}

export function useFireBaseAction(cb: () => Promise<void>) {
  const [status, action, isPending] = useActionState(
    async () => {
      try {
        await cb()
        return { success: true }
      } catch (e) {
        const error =
          e instanceof Error ? prettifyFireAuthErrors(e.message) : String(e)
        return { error }
      }
    },
    {} as { success?: boolean; error?: string },
  )

  return [status, action, isPending] as const
}
