import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/magic')({
  component: Outlet,
  beforeLoad({ search }) {
    if ('oobcode' in search) return
    throw redirect({ to: '/', replace: true })
  },
})
