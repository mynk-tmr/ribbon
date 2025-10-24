import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { AppHeader } from '@/components/app-header'

export const Route = createRootRoute({ component: RootComponent })

function RootComponent() {
  return (
    <React.Fragment>
      <TanStackRouterDevtools position="top-left" />
      <AppHeader />
      <Outlet />
    </React.Fragment>
  )
}
