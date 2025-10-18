import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
  beforeLoad({ context: { app_user } }) {
    if (app_user) throw redirect({ to: '/user/profile' })
  },
})

function RouteComponent() {
  return (
    <main className='mx-auto max-w-96'>
      <Outlet />
    </main>
  )
}
