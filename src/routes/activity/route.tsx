import { Icon } from '@iconify/react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AuthGuard } from '@/components/auth-guard'

export const Route = createFileRoute('/activity')({
  component: () => <AuthGuard missing={<Index />} authenticated={<Outlet />} />,
})

function Index() {
  return (
    <section className="page">
      <h1 className="text-4xl font-bold mb-6">Sign In to Track activity</h1>
      <Icon
        icon={'mdi:robot-happy'}
        className="text-4xl block mx-auto animate-pulse"
      />
    </section>
  )
}
