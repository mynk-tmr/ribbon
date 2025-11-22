import { firePrettify } from '@/helpers/pretty-firebase-error'
import { authStoreActions } from './useFireAuth'
import { useFormAction } from './useFormAction'

export default function useFireBaseAction<R>(cb: () => Promise<R>) {
  const [state, action] = useFormAction(async () => {
    const d = await cb()
    authStoreActions.refresh()
    return d
  })
  if (state.error) state.error.message = firePrettify.auth(state.error.message)
  return [state, action] as const
}
