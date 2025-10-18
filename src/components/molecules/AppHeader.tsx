import button from '@/styles/button'
import { link } from '@/styles/typography'
import { Link } from '@tanstack/react-router'
import { Logo } from '../atoms/Logo'

function AuthButton() {
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
      name: 'Search 💭',
      link: '/search',
    },
  ] as const

  return (
    <header className='border-b p-4 sm:px-6'>
      <div className='space-between flex flex-wrap items-center gap-y-4'>
        <Link to='/' title='Go to Home'>
          <Logo />
        </Link>
        <nav className='flex grow items-center justify-center gap-6'>
          {
            // TODO: add active class
            routes.map((route) => (
              <Link className={link()} key={route.name} to={route.link}>
                {route.name}
              </Link>
            ))
          }
        </nav>
        <AuthButton />
      </div>
    </header>
  )
}
