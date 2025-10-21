import { InputField } from '@/components/atoms/InputField'
import { sendResetPassword, sendSignInLink } from '@/lib/firebase/actions'
import { useFireBaseAction } from '@/lib/firebase/hooks'
import button from '@/styles/button'
import { card } from '@/styles/media'
import { headings, text } from '@/styles/typography'
import { Icon } from '@iconify/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/auth/passwordless')({
  component: RouteComponent,
  validateSearch(search) {
    return { t: search.t === 'login' ? 'login' : 'reset' } as const
  },
})

function RouteComponent() {
  const { t } = Route.useSearch()
  const [email, setEmail] = useState('')
  const [status, action] = useFireBaseAction(() => {
    return t === 'login' ? sendSignInLink(email) : sendResetPassword(email)
  })

  if (status.success) return <LinkSent email={email} />

  return (
    <form action={action} className='flex flex-col gap-4'>
      <h2 className={headings({ level: 'h2', class: 'capitalize' })}>
        {t === 'login' ? 'Login' : 'Reset Password'}
      </h2>
      {status.error && <p className='text-fireBrick'>{status.error}</p>}
      <InputField
        required
        value={email}
        onValueChange={setEmail}
        icon='mdi:email'
        placeholder='Email'
        name='laf-email'
      />
      <button type='submit' className={button({ intent: 'success' })}>
        Get Link
      </button>
      <Link to='/auth' search={{ isLogin: true }}>
        &larr; Back
      </Link>
    </form>
  )
}

function LinkSent({ email }: { email: string }) {
  return (
    <div className={card()}>
      <Icon
        icon='mdi:email-check-outline'
        className='text-4xl text-emerald-400'
      />

      <p>
        Link sent to <b className='text-steelBlue'>{email}</b>.
        <br />
        <br />
        Check your inbox — the sender name is{' '}
        <span className='text-darkOrange font-semibold'>learn-auth-flow</span>.
        <br />
      </p>

      <Link
        to='/auth'
        search={{ isLogin: true }}
        className={text({ as: 'label' })}
      >
        &larr; Back to Sign In
      </Link>
    </div>
  )
}
