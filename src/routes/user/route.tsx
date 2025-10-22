import { AuthGuard } from '@/components/helpers/AuthGuard'
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/user')({ component: RouteComponent })

function RouteComponent() {
  return (
    <AuthGuard
      whenAbsent={<Navigate replace to='/auth' search={{ isLogin: true }} />}
      whenExists={<Outlet />}
    />
  )
}
