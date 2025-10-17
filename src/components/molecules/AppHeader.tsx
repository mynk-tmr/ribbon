import button from '@/styles/button'
import { link } from '@/styles/typography'
import { Link } from '@tanstack/react-router'
import { Logo } from '../atoms/Logo'

function LoginButton() {
  return (
    <Link to='/auth' className={button({ intent: 'secondary', shape: 'pill' })}>
      Login
    </Link>
  )
}

export function AppHeader() {
  const routes = [
    {
      name: 'Discover ✨',
      link: '/discover',
    },
    {
      name: 'Search 🔎',
      link: '/search',
    },
  ] as const

  return (
    <header className='border-b p-4 sm:px-6'>
      <div className='space-between flex items-center'>
        <Link to='/' title='Go to Home'>
          <Logo />
        </Link>
        <nav className='flex grow items-center justify-center gap-6'>
          {
            // TODO: add active class
            routes.map((route) => (
              <Link key={route.name} to={route.link}>
                {({ isActive }) => (
                  <span className={link({ isActive })}>{route.name}</span>
                )}
              </Link>
            ))
          }
        </nav>
        <LoginButton />
      </div>
    </header>
  )
}
