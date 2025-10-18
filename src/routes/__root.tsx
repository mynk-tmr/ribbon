import { TopLoadingBar } from '@/components/atoms/TopLoadingBar'
import { AppHeader } from '@/components/molecules/AppHeader'
import { ErrorBoundary } from '@/components/pages/ErrorBoundary'
import { NotFound } from '@/components/pages/NotFound'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorBoundary,
})

function RootComponent() {
  return (
    <>
      <TanStackRouterDevtools />
      <TopLoadingBar />
      <AppHeader />
      <Outlet />
    </>
  )
}
