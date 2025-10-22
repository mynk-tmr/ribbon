import { InputField } from '@/components/atoms/InputField'
import { useFireBaseAction } from '@/hooks/useFireBaseAction'
import { auth } from '@/lib/firebase/init'
import button from '@/styles/button'
import { headings, link, text } from '@/styles/typography'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { useState } from 'react'

export const Route = createFileRoute('/auth/')({
  component: RouteComponent,
  validateSearch(search) {
    const exists = search.isLogin !== undefined
    return { isLogin: exists ? Boolean(search.isLogin) : true }
  },
})

function RouteComponent() {
  const { isLogin } = Route.useSearch()
  const fireApi = isLogin
    ? signInWithEmailAndPassword
    : createUserWithEmailAndPassword
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [reveal, setReveal] = useState(false)

  const [status, action, isPending] = useFireBaseAction(() =>
    fireApi(auth, email, password),
  )

  return (
    <form className='flex flex-col gap-4' action={action}>
      <Header />
      {status.error && !isPending && (
        <b
          className={text({
            as: 'tagline',
            className: 'text-fireBrick capitalize',
          })}
        >
          {status.error}
        </b>
      )}
      <InputField
        required
        value={email}
        onValueChange={setEmail}
        icon='mdi:email'
        placeholder='Email'
        name='laf-email'
      />
      <InputField
        required
        value={password}
        onValueChange={setPassword}
        type={reveal ? 'text' : 'password'}
        icon='mdi:lock'
        placeholder='Password'
        name='laf-password'
      />
      <label className='flex items-center gap-2'>
        <input
          type='checkbox'
          checked={reveal}
          onChange={() => setReveal(!reveal)}
        />
        Show password
      </label>
      <button
        disabled={isPending}
        type='submit'
        className={button({ intent: 'success' })}
      >
        {isPending ? 'Wait..' : isLogin ? 'Login' : 'Create Account'}
      </button>
      <BottomLinks />
    </form>
  )
}

function Header() {
  const { isLogin } = Route.useSearch()
  return (
    <header className='flex items-center justify-between'>
      <h1 className={headings({ level: 'h2', class: 'capitalize' })}>
        {isLogin ? 'Login' : 'Sign Up'}
      </h1>
      <Link to='.' search={{ isLogin: !isLogin }} className={link({})}>
        {isLogin ? 'No Account?' : 'Existing Account?'}
      </Link>
    </header>
  )
}

function BottomLinks() {
  return (
    <div className='text-silver grid gap-2 *:mx-auto'>
      <Link to='/auth/passwordless' search={{ t: 'login' }} className={link()}>
        Try Passwordless Auth ✨
      </Link>
      <Link to='/auth/passwordless' search={{ t: 'reset' }} className={link()}>
        Forgot Password ?
      </Link>
    </div>
  )
}
