import { Button, PasswordInput, TextInput } from '@mantine/core'
import { createFileRoute, Link } from '@tanstack/react-router'
import type React from 'react'
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
  return (
    <form
      className="space-y-4 sm:max-w-[340px]"
      onSubmit={(e) => e.preventDefault()}
    >
      <TextInput
        onChange={(e) => set({ email: e.target.value })}
        label="Email"
        required
        type="email"
        placeholder="Email address"
      />
      <PasswordInput
        onChange={(e) => set({ password: e.target.value })}
        label="Password"
        required
        description="8-32 characters, including a number, a letter, and a special character"
        placeholder="••••••••••••••••"
      />
      <OtherLinks />
      <Button className="w-full" type="submit">
        Sign in
      </Button>
    </form>
  )
}

const OtherLinks: React.FC = () => (
  <div className="flex text-sm justify-between *:hover:underline underline-offset-2">
    <Link to="/auth/passwordless" search={{ t: 'reset' }}>
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
