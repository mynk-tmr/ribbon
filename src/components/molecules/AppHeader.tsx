import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useAuth } from '@/lib/firebase/hooks'
import { link } from '@/styles/typography'
import { Icon } from '@iconify/react'
import { Link } from '@tanstack/react-router'
import { Logo } from '../atoms/Logo'

export function AppHeader() {
  const isMobile = useMediaQuery('(max-width: 640px)')
  const { user } = useAuth()
  const userRoute = user
    ? ({ name: 'Profile', link: '/user/profile', icon: 'mdi:account' } as const)
    : ({ name: 'Login', link: '/auth', icon: 'mdi:login' } as const)

  const routes = [
    { name: 'Discover', link: '/discover', icon: 'mdi:compass' },
    { name: 'Search', link: '/search', icon: 'mdi:magnify' },
    { name: 'Activity', link: '/user/activity', icon: 'mdi:history' },
    userRoute,
  ] as const

  let NAVBAR: React.ReactElement

  if (isMobile) {
    // --- Mobile bottom bar ---
    NAVBAR = (
      <nav className='bg-darkGray fixed right-0 bottom-0 left-0 z-50 flex justify-around rounded-t-sm py-2'>
        {routes.map((route) => (
          <Link
            key={route.link}
            to={route.link}
            className={link({ icon: 'stack' })}
          >
            <Icon icon={route.icon} className='text-xl' />
            <span>{route.name}</span>
          </Link>
        ))}
      </nav>
    )
  } else {
    // --- Desktop / Tablet Header ---
    NAVBAR = (
      <nav className='ml-auto flex items-center gap-6'>
        {routes.map((route) => (
          <Link className={link()} key={route.name} to={route.link}>
            <Icon icon={route.icon} />
            {route.name}
          </Link>
        ))}
      </nav>
    )
  }

  // --- Desktop / Tablet Header ---
  return (
    <header className='border-lightGray/30 border-b p-4 sm:px-6'>
      <div className='flex flex-wrap items-center justify-between gap-y-4'>
        <Logo className='w-fit not-sm:mx-auto' />
        {NAVBAR}
      </div>
    </header>
  )
}
