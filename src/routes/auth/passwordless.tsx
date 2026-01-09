import { Icon } from '@iconify/react'
import { Button, TextInput } from '@mantine/core'
import { createFileRoute, Link } from '@tanstack/react-router'
import { type } from 'arktype'
import { useState } from 'react'
import { API } from '@/application/api'
import { useFormAction } from '@/shared/hooks/useFormAction'

const schema = type({ t: "'login' | 'reset'" })

export const Route = createFileRoute('/auth/passwordless')({
  component: RouteComponent,
  validateSearch: schema,
})

function RouteComponent() {
  const search = Route.useSearch()
  const [email, setEmail] = useState('')
  const [status, action] = useFormAction(async () => {
    if (search.t === 'login') {
      await API.passwordLess.sendLoginLink(email)
    } else {
      await API.passwordLess.sendPasswordReset(email)
    }
  })

  if (status.success) return <EmailSendSuccess />

  return (
    <main className="page">
      <form action={action} className="space-y-4 min-w-xs">
        <h2 className="text-2xl font-bold capitalize">Send {search.t} Link</h2>
        {status.error && (
          <p className="text-red-400 text-sm">{status.error.message}</p>
        )}
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
        Email Sent{' '}
        <Icon icon="mdi:check" className="text-green-400 inline ml-2" />
      </h2>
      <p className="text-sm">
        Check your inbox for a link to{' '}
        {search.t === 'login'
          ? 'sign in into your account'
          : 'reset your password'}
        .
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
