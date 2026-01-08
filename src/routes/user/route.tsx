import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'
import { AuthGuard } from '@/components/auth-guard'
import { useAuth } from '@/shared/hooks/useAuth'
import { dicebear } from '@/shared/utils/freebies'

export const Route = createFileRoute('/user')({
  component: () => (
    <AuthGuard
      authenticated={<RouteComponent />}
      missing={<Navigate to="/auth" search={{ login: true }} replace />}
    />
  ),
})

function RouteComponent() {
  return (
    <main className="page">
      <section className="sm:min-w-sm p-6 sm:px-10">
        <Header />
        <div className="my-4 border-t border-neutral-500/50" />
        <Outlet />
      </section>
      <UserID />
    </main>
  )
}

function Header() {
  const { user } = useAuth()
  if (!user) return
  return (
    <header className="flex flex-wrap items-center gap-6">
      <img
        src={dicebear(user.uid)}
        alt="User Avatar"
        className="size-28 rounded-full ring p-1"
      />
      <div>
        <h1 className="text-2xl font-bold">{user.email}</h1>
        <span className="text-sm">{user.email}</span>
      </div>
    </header>
  )
}

function UserID() {
  const { user } = useAuth()
  if (!user) return
  return (
    <div className="mt-4 grid gap-y-2 *:text-center opacity-30">
      <small className="text-xs">User ID:</small>
      <small className="text-xs italic">{user.uid}</small>
    </div>
  )
}
