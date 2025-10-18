import button from '@/styles/button'
import { headings } from '@/styles/typography'
import { Icon } from '@iconify/react'
import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <main className='grid place-items-center space-y-9'>
      <Icon icon='mdi:emoticon-sad' width={100} height={100} />
      <h1 className={headings({ level: 'h1', className: 'italic' })}>
        Page Not Found
      </h1>
      <p className={headings({ level: 'h3', className: 'text-lightGray' })}>
        The page you are looking for does not exist.
      </p>
      <Link
        replace
        to='/'
        className={button({ intent: 'success', shape: 'pill' })}
      >
        Go to Home
      </Link>
    </main>
  )
}
