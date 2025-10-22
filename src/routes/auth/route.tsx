import { AuthGuard } from '@/components/helpers/AuthGuard'
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({ component: RouteComponent })

function RouteComponent() {
  return (
    <AuthGuard
      whenAbsent={
        <div className='mx-auto max-w-[400px]'>
          <Outlet />
        </div>
      }
      whenExists={<Navigate replace to='/user/profile' />}
    />
  )
}
