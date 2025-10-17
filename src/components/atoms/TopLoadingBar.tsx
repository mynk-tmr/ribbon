import { useRouterState } from '@tanstack/react-router'

export function TopLoadingBar() {
  const { isLoading, isTransitioning } = useRouterState()
  if (!isLoading && !isTransitioning) {
    return null
  }
  return (
    <div className={`fixed top-0 left-0 z-50 h-0.5 w-full`}>
      <div className='animate-progress bg-blueViolet h-full w-full' />
    </div>
  )
}
