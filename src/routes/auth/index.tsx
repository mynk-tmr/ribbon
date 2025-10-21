import { InputField } from '@/components/atoms/InputField'
import { auth } from '@/lib/firebase/init'
import { prettifyFireAuthErrors } from '@/lib/firebase/utils'
import button from '@/styles/button'
import { headings, link, text } from '@/styles/typography'
import { Icon } from '@iconify/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { useState, useTransition } from 'react'

export const Route = createFileRoute('/auth/')({
  component: RouteComponent,
  validateSearch(search) {
    return { isLogin: search.isLogin ? true : false }
  },
})

function RouteComponent() {
  const { isLogin } = Route.useSearch()
  const fireApi = isLogin
    ? signInWithEmailAndPassword
    : createUserWithEmailAndPassword
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [reveal, setReveal] = useState(false)

  const [isPending, startTransition] = useTransition()

  return (
    <form
      className='flex flex-col gap-4'
      onSubmit={(e) => {
        e.preventDefault()
        startTransition(() => {
          setError(null)
          fireApi(auth, email, password).catch((e) => {
            setError(prettifyFireAuthErrors(e.message))
          })
        })
      }}
    >
      <Header />
      {error && <ErrorDisplay error={error} onClear={() => setError(null)} />}
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
        {isLogin ? 'Login' : 'Create Account'}
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

function ErrorDisplay(props: { error: string; onClear: () => void }) {
  return (
    <div className='flex items-center justify-between'>
      <b className={text({ as: 'tagline', className: 'text-fireBrick' })}>
        {props.error}
      </b>
      <Icon
        role='button'
        icon='mdi:close-circle'
        className='cursor-pointer'
        color='white'
        onClick={props.onClear}
      />
    </div>
  )
}

function BottomLinks() {
  return (
    <div className='text-silver grid gap-2 *:mx-auto'>
      <Link
        to='/auth/passwordless'
        search={{ t: 'login' }}
        className={link({})}
      >
        Try Passwordless Auth ✨
      </Link>
      <Link
        to='/auth/passwordless'
        search={{ t: 'reset' }}
        className={link({})}
      >
        Forgot Password ?
      </Link>
    </div>
  )
}
