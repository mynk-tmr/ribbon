import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'
import { AuthGuard } from '@/components/auth-guard'

export const Route = createFileRoute('/auth')({
  component: () => (
    <AuthGuard
      missing={<Outlet />}
      authenticated={<Navigate to="/user/profile" replace />}
    />
  ),
})
