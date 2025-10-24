import { Icon } from '@iconify/react'
import { Button } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Link, useRouterState } from '@tanstack/react-router'

type RouteLink = { name: string; link: string; icon: string }

const Links: React.FC = () => {
  const { location } = useRouterState()
  const isMobile = useMediaQuery('(max-width: 640px)')
  const user = false
  const loading = false

  function getLinks(): RouteLink[] {
    const routes = [
      { name: 'Discover', link: '/discover', icon: 'mdi:compass' },
      { name: 'Search', link: '/search', icon: 'mdi:magnify' },
      { name: 'Activity', link: '/activity', icon: 'mdi:history' },
    ]
    if (loading) routes.push({ name: 'Wait ..', link: '/', icon: 'mdi:dots-grid' })
    else if (user) routes.push({ name: 'Profile', link: '/user/profile', icon: 'mdi:account' })
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
            color={location.pathname === route.link ? 'blue.4' : 'gray'}
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
    <header className="p-4 sm:px-6 bg-black/20">
      <div className="flex flex-wrap items-center">
        <h1 className="text-2xl font-bold">Ribbon</h1>
        {isMobile ? (
          <nav className="fixed bottom-0 left-0 right-0 pb-1 z-50 flex justify-around">
            <Links />
          </nav>
        ) : (
          <nav className="ml-auto flex items-center gap-4">
            <Links />
          </nav>
        )}
      </div>
    </header>
  )
}
