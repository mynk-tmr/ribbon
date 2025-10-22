import { InputField } from '@/components/atoms/InputField'
import { useFireBaseAction } from '@/hooks/useFireBaseAction'
import { useMergedState } from '@/hooks/useMergedState'
import { changeEmail } from '@/lib/firebase/actions'
import { useFireAuth } from '@/lib/firebase/store'
import button from '@/styles/button'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/user/profile/emailchange')({
  component: RouteComponent,
})

function RouteComponent() {
  const { USER } = useFireAuth()
  const [values, update] = useMergedState({
    email: USER.email ?? '',
    password: '',
    reveal: false,
  })
  const [state, formAction, isPending] = useFireBaseAction(async () => {
    const { email, password } = values
    if (email !== USER.email) {
      await changeEmail(email, password)
    }
  })

  if (state.success) {
    return (
      <div className='w-full space-y-4 px-4'>
        <p>Check your email for verification link.</p>
        <p>
          After verification, you sign in with{' '}
          <b className='text-steelBlue'>new email.</b>
        </p>
        <Link
          className={button({ intent: 'secondary', size: 'sm' })}
          to='/user/profile'
        >
          Go to Profile
        </Link>
      </div>
    )
  }

  return (
    <form action={formAction} className='w-full'>
      <fieldset disabled={isPending} className='grid gap-y-6'>
        <InputField
          icon='mdi:email'
          name='email'
          label='Email'
          value={values.email}
          onValueChange={(value) => update({ email: value })}
          type='email'
          required
          helper='Changing Email requires re-verification of new email. You will be logged out.'
        />
        <div className='relative'>
          <InputField
            icon='mdi:lock'
            name='password'
            label='Password'
            value={values.password}
            onValueChange={(value) => update({ password: value })}
            type={values.reveal ? 'text' : 'password'}
            required
            error={state.error}
          />
          <button
            type='button'
            className='absolute top-1/2 right-2'
            onClick={() => update({ reveal: !values.reveal })}
          >
            {values.reveal ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className='space-x-4 text-end'>
          <button
            type='submit'
            disabled={values.email === USER.email}
            className={button({ intent: 'warning', size: 'sm' })}
          >
            {isPending ? 'Wait' : 'Change'}
          </button>
          <Link
            to='/user/profile'
            className={button({ intent: 'secondary', size: 'sm' })}
          >
            Cancel
          </Link>
        </div>
      </fieldset>
    </form>
  )
}
