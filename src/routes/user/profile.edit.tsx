import { InputField } from '@/components/atoms/InputField'
import { useFireBaseAction } from '@/hooks/useFireBaseAction'
import { useMergedState } from '@/hooks/useMergedState'
import { useFireAuth } from '@/lib/firebase/store'
import button from '@/styles/button'
import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import { updateProfile } from 'firebase/auth'

export const Route = createFileRoute('/user/profile/edit')({
  component: EditProfile,
})

function EditProfile() {
  const { USER, refresh } = useFireAuth()
  const [values, update] = useMergedState({
    displayName: USER.displayName ?? '',
    photoURL: USER.photoURL ?? '',
    email: USER.email ?? '',
  })

  const [state, formAction, isPending] = useFireBaseAction(async () => {
    const { displayName, photoURL } = values
    if (displayName !== USER.displayName || photoURL !== USER.photoURL) {
      await updateProfile(USER, { displayName, photoURL })
      refresh()
    }
  })

  if (state.success) return <Navigate replace to='/user/profile' />

  return (
    <form action={formAction}>
      {state.error && <p className='bg-fireBrick mb-2 px-2'>{state.error}</p>}
      <fieldset disabled={isPending} className='grid w-full gap-y-6'>
        <InputField
          icon='mdi:robot-happy'
          name='displayName'
          label='Display Name'
          value={values.displayName}
          onValueChange={(value) => update({ displayName: value })}
        />
        <InputField
          icon='mdi:image'
          name='photoURL'
          label='Photo URL [https://]'
          value={values.photoURL}
          onValueChange={(value) => update({ photoURL: value })}
          type='url'
        />
        <InputField
          icon='mdi:email'
          name='email'
          label='Email'
          value={values.email}
          onValueChange={(value) => update({ email: value })}
          type='email'
          helper='Your old email will recieve a link to revert this, if needed.'
        />
        <div className='space-x-4 text-end'>
          <button
            type='submit'
            className={button({ intent: 'success', size: 'sm' })}
          >
            {isPending ? 'Wait' : 'Save'}
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
