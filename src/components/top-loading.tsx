import { useRouterState } from '@tanstack/react-router'

export default function TopLoading() {
  const isIdle = useRouterState({ select: ({ status }) => status === 'idle' })
  if (!isIdle)
    return (
      <div className="fixed animate-progress top-0 left-0 w-full h-1 bg-violet-500 z-50" />
    )
}
