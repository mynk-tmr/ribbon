import { useActionState } from 'react'

export function useFormAction<T, ErrType = Error>(action: () => Promise<T>) {
  const status = {
    success: false,
    error: null as ErrType | null,
    data: null as T | null,
  }
  const [state, start, pending] = useActionState(async () => {
    try {
      const data = await action()
      return { success: true, error: null, data }
    } catch (error) {
      return { success: false, error: error as ErrType, data: null }
    }
  }, status)

  return [{ ...state, pending }, start] as const
}
