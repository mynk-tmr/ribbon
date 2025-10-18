import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/user/profile')({
  component: RouteComponent,
  beforeLoad({ context: { app_user } }) {
    if (!app_user) throw redirect({ to: '/auth', search: { isLogin: true } })
  },
})

function RouteComponent() {
  return <div>Hello "/user/profile"!</div>
}
