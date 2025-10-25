import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { AppHeader } from '@/components/app-header'
import { ShowError } from '@/components/show-error'
import TopLoading from '@/components/top-loading'

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ShowError,
})

function RootComponent() {
  return (
    <React.Fragment>
      <TanStackRouterDevtools position="top-left" />
      <TopLoading />
      <AppHeader />
      <Outlet />
    </React.Fragment>
  )
}
