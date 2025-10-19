import { useReducer } from 'react'

type Validator<T> = (values: T) => Record<keyof T, string>

type State<T extends Record<string, unknown>> = {
  current: T
  initial: T
  touchedKeys: Set<keyof T>
}

type Action<T> =
  | { type: 'update'; field: keyof T; value: T[keyof T] }
  | { type: 'reset' }
  | { type: 'touch'; field: keyof T }

function reducer<T extends Record<string, unknown>>(
  state: State<T>,
  action: Action<T>,
): State<T> {
  switch (action.type) {
    case 'update': {
      return {
        ...state,
        current: { ...state.current, [action.field]: action.value },
        touchedKeys: new Set(state.touchedKeys).add(action.field),
      }
    }
    case 'touch': {
      return {
        ...state,
        touchedKeys: new Set(state.touchedKeys).add(action.field),
      }
    }
    case 'reset': {
      return { ...state, current: state.initial, touchedKeys: new Set() }
    }
    default:
      return state
  }
}

/**
 * useValidatedForm
 * Generic, reusable hook for forms with validation
 */
export function useForm<T extends Record<string, unknown>>(
  initial: T,
  validate: Validator<T>,
) {
  const [state, dispatch] = useReducer(reducer<T>, {
    current: initial,
    initial,
    touchedKeys: new Set<keyof T>(),
  })

  // Run validation
  const validated = validate(state.current)

  // Only show errors for touched fields
  const errors = {} as Record<keyof T, string>
  for (const key in validated) {
    errors[key] = state.touchedKeys.has(key) ? validated[key] : ''
  }

  return {
    values: state.current,
    errors,
    touched: state.touchedKeys,
    update: (field: keyof T, value: T[keyof T]) =>
      dispatch({ type: 'update', field, value }),
    touch: (field: keyof T) => dispatch({ type: 'touch', field }),
    reset: () => dispatch({ type: 'reset' }),
    isValid: !Object.values(validated).some(Boolean),
  } as const
}
