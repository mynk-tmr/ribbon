import { TopLoadingBar } from '@/components/atoms/TopLoadingBar'
import { AppHeader } from '@/components/molecules/AppHeader'
import { ErrorBoundary } from '@/components/pages/ErrorBoundary'
import { NotFound } from '@/components/pages/NotFound'
import type { context } from '@/main'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRouteWithContext<typeof context>()({
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorBoundary,
})

function RootComponent() {
  return (
    <>
      <TanStackRouterDevtools position='top-left' />
      <TopLoadingBar />
      <AppHeader />
      <div className='mx-auto max-w-7xl pt-8'>
        <Outlet />
      </div>
    </>
  )
}
