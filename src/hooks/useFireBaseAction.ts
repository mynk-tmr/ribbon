import { prettifyFireAuthErrors } from '@/lib/firebase/utils'
import { useActionState } from 'react'

export function useFireBaseAction<T>(cb: () => Promise<T>) {
  return useActionState(
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
}
