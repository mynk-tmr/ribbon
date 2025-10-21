import button from '@/styles/button'
import { card } from '@/styles/media'
import { headings } from '@/styles/typography'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/magic/resetPassword')({
  component: ResetDone,
})

function ResetDone() {
  return (
    <div className={card()}>
      <h2 className={headings({ level: 'h4' })}>Process Complete ✅</h2>
      <p className='text-cornflowerBlue'>
        Password reset successfully. You need to sign in again
      </p>
      <Link
        replace
        to='/auth'
        search={{ isLogin: true }}
        className={button({ intent: 'secondary', size: 'sm' })}
      >
        Sign In
      </Link>
    </div>
  )
}
