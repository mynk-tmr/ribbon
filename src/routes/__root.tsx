import { TopLoadingBar } from '@/components/atoms/TopLoadingBar'
import { AppHeader } from '@/components/molecules/AppHeader'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
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
