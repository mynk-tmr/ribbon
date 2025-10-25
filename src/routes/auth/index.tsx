import { Button, PasswordInput, TextInput } from '@mantine/core'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import type React from 'react'
import { auth } from '@/config/firebase'
import { firePrettify } from '@/helpers/pretty-firebase-error'
import { useFormAction } from '@/hooks/useFormAction'
import { useMergedState } from '@/hooks/useMergedState'

export const Route = createFileRoute('/auth/')({
  component: RouteComponent,
  validateSearch: (s) => {
    const login = Boolean(s.login ?? true)
    return { login }
  },
})

function RouteComponent() {
  const search = Route.useSearch()

  return (
    <main className="page">
      <h1 className="text-3xl font-bold mb-6">
        {search.login ? 'Sign in' : 'Create Account'}
      </h1>
      <Form />
      <BottomLink />
    </main>
  )
}

const Form: React.FC = () => {
  const [state, set] = useMergedState({ email: '', password: '' })
  const search = Route.useSearch()
  const [status, action] = useFormAction(() =>
    search.login
      ? signInWithEmailAndPassword(auth, state.email, state.password)
      : createUserWithEmailAndPassword(auth, state.email, state.password),
  )
  return (
    <form action={action} className="space-y-4 sm:max-w-[340px]">
      <div>
        {!status.pending && status.error && (
          <p className="text-red-400 text-sm">
            {firePrettify.auth(status.error.message)}
          </p>
        )}
      </div>
      <TextInput
        value={state.email}
        onChange={(e) => set({ email: e.target.value })}
        label="Email"
        required
        type="email"
        placeholder="Email address"
      />
      <PasswordInput
        value={state.password}
        onChange={(e) => set({ password: e.target.value })}
        label="Password"
        required
        description="8-32 characters, including a number, a letter, and a special character"
        placeholder="••••••••••••••••"
      />
      <OtherLinks />
      <Button
        loading={status.pending}
        disabled={status.pending}
        className="w-full"
        type="submit"
      >
        {search.login ? 'Sign in' : 'Create Account'}
      </Button>
    </form>
  )
}

const OtherLinks: React.FC = () => (
  <div className="flex text-sm justify-between *:hover:underline underline-offset-2">
    <Link to="/auth/passwordless" search={{ t: 'login' }}>
      Use Magic Link ✨
    </Link>
    <Link to="/auth/passwordless" search={{ t: 'reset' }}>
      Forgot Password?
    </Link>
  </div>
)

const BottomLink: React.FC = () => {
  const { login } = Route.useSearch()
  return (
    <div className="space-x-2 text-center mt-4">
      <span>{login ? 'New to Ribbon? ' : 'Already have an account? '}</span>
      <Link
        className="text-pink-600 font-medium hover:text-pink-500"
        to="/auth"
        search={{ login: !login }}
      >
        {login ? 'Create Account' : 'Sign in'}
      </Link>
    </div>
  )
}
