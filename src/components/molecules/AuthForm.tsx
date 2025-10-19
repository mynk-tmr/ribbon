import { useForm } from '@/hooks/useForm'
import button from '@/styles/button'
import { headings } from '@/styles/typography'
import { useActionState } from 'react'
import { InputField } from '../atoms/InputField'

export function AuthForm(props: {
  isLogin: boolean
  onModeChange: () => void
}) {
  const { values, errors, update, isValid } = useForm(
    {
      email: '',
      password: '',
      fullname: '',
      confirm: '',
      reveal: false,
    },
    (state) => ({
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)
        ? ''
        : 'Invalid email',
      password: /^\S{8,30}$/.test(state.password)
        ? ''
        : 'must be 8-30 chars, no spaces',
      fullname: props.isLogin
        ? ''
        : state.fullname.trim().length > 3
          ? ''
          : 'must be at least 3 chars',
      confirm: props.isLogin
        ? ''
        : !/^\S{8,30}$/.test(state.confirm)
          ? 'must be 8-30 chars, no spaces'
          : state.password === state.confirm
            ? ''
            : 'Passwords do not match',
      isLogin: '',
      reveal: '',
    }),
  )

  const [, action, isPending] = useActionState(async () => {
    if (!isValid) return
    await new Promise((r) => setTimeout(r, 1200))
    alert(JSON.stringify(values, null, 2))
  }, null)

  return (
    <form action={action} className='flex w-full flex-col gap-3'>
      <header className='flex items-center justify-between'>
        <h1 className={headings({ level: 'h3' })}>
          {props.isLogin ? 'Sign In' : 'Create Account'}
        </h1>
        <button
          type='button'
          className={button({
            intent: 'secondary',
            size: 'sm',
            className: 'self-end',
          })}
          onClick={props.onModeChange}
        >
          {props.isLogin ? 'No account?' : 'Have an account?'}
        </button>
      </header>
      {!props.isLogin && (
        <InputField
          value={values.fullname}
          onValueChange={(value) => update('fullname', value)}
          required
          icon='mdi:account'
          label='Full Name'
          error={errors.fullname}
        />
      )}
      <InputField
        value={values.email}
        onValueChange={(value) => update('email', value)}
        required
        icon='mdi:email'
        type='email'
        label='Email'
        error={errors.email}
      />
      <InputField
        value={values.password}
        onValueChange={(value) => update('password', value)}
        required
        icon='mdi:lock'
        type={values.reveal ? 'text' : 'password'}
        label='Password'
        error={errors.password}
      />
      {!props.isLogin && (
        <InputField
          value={values.confirm}
          onValueChange={(value) => update('confirm', value)}
          required
          icon='mdi:key'
          type={values.reveal ? 'text' : 'password'}
          label='Confirm Password'
          error={errors.confirm}
        />
      )}
      <button
        type='button'
        className='cursor-pointer self-end font-medium text-white'
        onClick={() => update('reveal', !values.reveal)}
      >
        {values.reveal ? 'Hide' : 'Show'} Password
      </button>
      <button
        disabled={isPending}
        type='submit'
        className={button({ intent: 'primary', disabled: isPending })}
      >
        {isPending ? '...' : 'Submit'}
      </button>
    </form>
  )
}
