import { useReducer } from 'react'

export function useMergedState<T>(initial: T) {
  const [state, update] = useReducer(
    (prev: T, next: Partial<T>) => ({ ...prev, ...next }),
    initial,
  )
  const reset = () => update(initial)
  return [state, update, reset] as const
}
