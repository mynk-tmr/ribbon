import { Icon } from '@iconify/react'
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'
import { AuthGuard } from '@/components/auth-guard'
import cn from '@/helpers/cn'
import { dicebear } from '@/helpers/freebies'
import { useFireAuthSlice } from '@/hooks/useFireAuth'

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
    <main className="w-fit mx-auto mt-4 px-8 py-4 rounded-md bg-black/20 border border-neutral-500/20">
      <Header />
      <div className="my-4 border-t border-neutral-500/20" />
      <Outlet />
    </main>
  )
}

function Header() {
  const user = useFireAuthSlice((state) => state.user)
  if (!user) return
  return (
    <header className="flex flex-wrap items-center gap-6">
      <img
        src={user.photoURL || dicebear(user.uid)}
        alt="User Avatar"
        className="size-28 rounded-full ring ring-neutral-100"
      />
      <div>
        <h1 className="text-2xl font-bold">{user.displayName || 'Anonymous'}</h1>
        <span className="text-sm">
          {user.email}
          <Icon
            className="inline ml-2"
            icon={cn.filter(
              user.emailVerified
                ? 'material-symbols:verified'
                : 'mdi:alert-circle-outline',
            )}
          />
        </span>
      </div>
    </header>
  )
}
