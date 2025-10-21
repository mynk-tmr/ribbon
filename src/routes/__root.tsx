import { TopLoadingBar } from '@/components/atoms/TopLoadingBar'
import { AppHeader } from '@/components/molecules/AppHeader'
import { ErrorBoundary } from '@/components/pages/ErrorBoundary'
import { NotFound } from '@/components/pages/NotFound'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRouteWithContext()({
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
