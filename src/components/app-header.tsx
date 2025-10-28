import { Icon } from '@iconify/react'
import { Button } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Link } from '@tanstack/react-router'
import cn from '@/helpers/cn'
import { useFireAuthStore } from '@/hooks/useFireAuth'
import Logo from './logo'

type RouteLink = { name: string; link: string; icon: string }

const Links: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 640px)')
  const { loading, user } = useFireAuthStore()

  function getLinks(): RouteLink[] {
    const routes = [
      { name: 'Discover', link: '/discover', icon: 'mdi:compass' },
      { name: 'Search', link: '/search', icon: 'mdi:magnify' },
      { name: 'Activity', link: '/activity', icon: 'mdi:history' },
    ]
    if (loading) routes.push({ name: 'Wait ..', link: '/', icon: 'mdi:dots-grid' })
    else if (user)
      routes.push({ name: 'Profile', link: '/user/profile', icon: 'mdi:account-box' })
    else routes.push({ name: 'Login', link: '/auth', icon: 'mdi:login' })

    return routes
  }
  return (
    <>
      {getLinks().map((route) => (
        <div key={route.name} className="flex flex-col items-center">
          <Button
            component={Link}
            to={route.link}
            color="gray"
            activeProps={{ className: 'text-blue-400' }}
            variant="subtle"
          >
            <Icon icon={route.icon} className="text-xl mr-2" />
            {!isMobile && route.name}
          </Button>
          {isMobile && <small>{route.name}</small>}
        </div>
      ))}
    </>
  )
}

export const AppHeader: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 640px)')
  return (
    <header className="p-4 sm:px-6">
      <div className="flex flex-wrap items-center">
        <div className="grow flex justify-center md:justify-start">
          <Logo className="sm:[&+span]:text-2xl md:[&+span]:text-3xl" />
        </div>
        <nav
          className={cn.filter(
            isMobile &&
              'fixed bottom-0 left-0 right-0 pb-1 z-50 flex justify-around glowBg before:absolute',
            !isMobile && 'flex items-center gap-4',
          )}
        >
          <Links />
        </nav>
      </div>
    </header>
  )
}
