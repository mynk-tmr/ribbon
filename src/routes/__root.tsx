import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import AppNewHeader from '@/components/app-new-header'
import { NotFound } from '@/components/not-found'
import ScrollToTop from '@/components/scroll-to-top'
import { ShowError } from '@/components/show-error'
import TopLoading from '@/components/top-loading'

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ShowError,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return (
    <>
      <TanStackRouterDevtools position="top-left" />
      <TopLoading />
      <AppNewHeader />
      <Outlet />
      <ScrollToTop />
    </>
  )
}
