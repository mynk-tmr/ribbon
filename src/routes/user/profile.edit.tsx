import { InputField } from '@/components/atoms/InputField'
import { updateUserInfo } from '@/lib/firebase/actions'
import { useAuth } from '@/lib/firebase/hooks'
import { prettifyFireAuthErrors } from '@/lib/firebase/utils'
import button from '@/styles/button'
import { card } from '@/styles/media'
import { headings } from '@/styles/typography'
import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import { useActionState } from 'react'

export const Route = createFileRoute('/user/profile/edit')({
  component: EditProfile,
})

function EditProfile() {
  const { user } = useAuth()
  const [state, formAction, isPending] = useActionState(
    async (_: unknown, formData: FormData) => {
      const displayName = formData.get('displayName') as string
      const photoURL = formData.get('photoURL') as string
      const email = formData.get('email') as string

      try {
        await updateUserInfo({ displayName, photoURL, email })
      } catch (e) {
        return e instanceof Error
          ? prettifyFireAuthErrors(e.message)
          : String(e)
      }

      return 'success'
    },
    null,
  )

  if (!user) return null

  return (
    <form action={formAction} className={card({})}>
      <h2 className={headings({ level: 'h4' })}>Edit Profile</h2>

      <div className='grid gap-y-6 md:min-w-sm'>
        <InputField
          icon='mdi:robot-happy'
          name='displayName'
          label='Display Name'
          defaultValue={user.displayName ?? ''}
        />
        <InputField
          icon='mdi:image'
          name='photoURL'
          label='Photo URL [https://]'
          defaultValue={user.photoURL ?? ''}
          type='url'
        />
        <InputField
          icon='mdi:email'
          name='email'
          label='Email'
          defaultValue={user.email ?? ''}
          type='email'
          helper='Your old email will recieve a link to revert this, if needed.'
        />
      </div>

      <div className='flex w-full justify-between gap-3 border-t pt-2'>
        <button disabled={isPending} className={button({ intent: 'primary' })}>
          {isPending ? 'Saving…' : 'Save Changes'}
        </button>
        <Link
          to='..'
          disabled={isPending}
          className={button({ intent: 'secondary' })}
        >
          Cancel
        </Link>
      </div>

      {state === 'success' && <Navigate replace to='/user/profile' />}
      {state && state !== 'success' && (
        <p className='text-fireBrick'>{state}</p>
      )}
    </form>
  )
}
