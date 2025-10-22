import { whenSignInLink } from '@/lib/firebase/actions'
import button from '@/styles/button'
import { card } from '@/styles/media'
import { headings } from '@/styles/typography'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { FirebaseError } from 'firebase/app'

export const Route = createFileRoute('/magic/signIn')({
  component: () => null,
  async beforeLoad() {
    await whenSignInLink()
    return redirect({ to: '/user/profile', replace: true })
  },
  errorComponent: ({ error }) => {
    if (error instanceof FirebaseError === false) throw error
    return <ErrorComponent />
  },
})

function ErrorComponent() {
  return (
    <div className={card()}>
      <h2 className={headings({ level: 'h4' })}>SignIn Failed ❌</h2>
      <p className='text-silver'>Something went wrong</p>
      <Link
        replace
        to='/auth/passwordless'
        search={{ t: 'login' }}
        className={button({ intent: 'secondary', size: 'sm' })}
      >
        Try Again
      </Link>
    </div>
  )
}
