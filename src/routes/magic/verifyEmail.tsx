import button from '@/styles/button'
import { card } from '@/styles/media'
import { headings } from '@/styles/typography'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/magic/verifyEmail')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className={card()}>
      <h2 className={headings({ level: 'h4' })}>Process Complete ✅</h2>
      <p className='text-cornflowerBlue'>Email verified successfully</p>
      <Link
        replace
        to='/user/profile'
        search={{ isLogin: true }}
        className={button({ intent: 'secondary', size: 'sm' })}
      >
        Go to Profile
      </Link>
    </div>
  )
}
