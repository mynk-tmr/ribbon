import { Icon } from '@iconify/react'
import { Button, TextInput } from '@mantine/core'
import { createFileRoute, Link } from '@tanstack/react-router'
import { sendPasswordResetEmail, sendSignInLinkToEmail } from 'firebase/auth'
import { useState } from 'react'
import { actionCodeSettings, auth } from '@/config/firebase'
import useFireBaseAction from '@/hooks/useFireBaseAction'

export const Route = createFileRoute('/auth/passwordless')({
  component: RouteComponent,
  validateSearch: (s) => {
    if (s.t === 'login' || s.t === 'reset') return { t: s.t } as const
    return { t: 'login' } as const
  },
})

function RouteComponent() {
  const search = Route.useSearch()
  const action = search.t === 'login' ? sendSignInLinkToEmail : sendPasswordResetEmail
  const [email, setEmail] = useState('')
  const [status, start] = useFireBaseAction(async () => {
    if (search.t === 'login') window.localStorage.setItem('emailForSignIn', email)
    action(auth, email, actionCodeSettings)
  })

  if (status.success) return <EmailSendSuccess />

  return (
    <main className="page">
      <form action={start} className="space-y-4 min-w-xs">
        <h2 className="text-2xl font-bold capitalize">Send {search.t} Link</h2>
        {status.error && <p className="text-red-400 text-sm">{status.error.message}</p>}
        <TextInput
          required
          label="Email"
          value={email}
          leftSection={<Icon icon="mdi:email" />}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex gap-x-4 items-center">
          <Button
            size="sm"
            type="submit"
            loading={status.pending}
            disabled={status.pending}
          >
            Send Link
          </Button>
          <Link
            className="text-white text-sm font-medium hover:text-neutral-200"
            to="/auth"
            search={{ login: true }}
          >
            Go Back
          </Link>
        </div>
      </form>
    </main>
  )
}

function EmailSendSuccess() {
  const search = Route.useSearch()
  return (
    <main className="page space-y-4">
      <h2 className="text-2xl font-bold">
        Email Sent <Icon icon="mdi:check" className="text-green-400 inline ml-2" />
      </h2>
      <p className="text-sm">
        Check your inbox for a link to{' '}
        {search.t === 'login' ? 'sign in into your account' : 'reset your password'}.
      </p>
      <p className="text-sm">
        The sender name is <b className="text-violet-400">Ribbon</b> and url is{' '}
        <b className="text-yellow-400">learn-auth-flow</b>.
      </p>
      <Link
        className="text-pink-400 text-sm font-medium hover:text-pink-600"
        to="/auth"
        search={{ login: true }}
      >
        Go Back
      </Link>
    </main>
  )
}
