import { useReducer } from 'react'

export function useMergedState<T>(init: T) {
  const [state, set] = useReducer(
    (state: T, newState: Partial<T>) => ({ ...state, ...newState }),
    init,
  )
  const reset = () => set(init)
  return [state, set, reset] as const
}
