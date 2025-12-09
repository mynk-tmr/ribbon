import { Icon } from '@iconify/react'
import { Link } from '@tanstack/react-router'
import cn from '@/helpers/cn'
import { useFireAuthStore } from '@/hooks/useFireAuth'
import Logo from './logo'

type RouteLink = { name: string; link: string; icon: string }

function useRouteLinks() {
  const { loading, user } = useFireAuthStore()
  const routes: RouteLink[] = [
    { name: 'Discover', link: '/discover', icon: 'mdi:compass' },
    { name: 'Search', link: '/search', icon: 'mdi:magnify' },
    { name: 'Activity', link: '/activity', icon: 'mdi:heart-pulse' },
    cn.first(
      loading && { name: 'Wait ..', link: '/', icon: 'mdi:dots-grid' },
      user && {
        name: 'Profile',
        link: '/user/profile',
        icon: 'mdi:account-box',
      },
      { name: 'Login', link: '/auth', icon: 'mdi:login' },
    ) as RouteLink,
  ]
  return routes
}

export default function AppNewHeader() {
  const routes = useRouteLinks()
  return (
    <nav className="fixed bottom-3 top-auto sm:bottom-auto sm:top-5 left-1/2 -translate-x-1/2 bg-dark/40 backdrop-blur-md border border-gray-100/10 rounded-full px-8 py-3 z-1000">
      <div className="flex items-center justify-between gap-10">
        {/* Center Links */}
        <div className="flex items-center gap-8">
          <Logo />
          <ul className="flex list-none gap-8">
            {routes.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.link}
                  activeProps={{ className: 'text-blue-400' }}
                  className={`flex flex-col items-center sm:gap-2 sm:flex-row font-medium text-[0.95rem] transition-all duration-300`}
                >
                  <Icon icon={link.icon} className="text-xl" />
                  <span className="hidden sm:inline-block">{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
