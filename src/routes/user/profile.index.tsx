import { UserProfile } from '@/components/organisms/UserProfile'
import {
  sendEmailVerificationLink,
  sendResetPassword,
} from '@/lib/firebase/actions'
import { AuthGuard } from '@/lib/firebase/AuthGuard'
import { useAuth, useFireBaseAction } from '@/lib/firebase/hooks'
import { auth } from '@/lib/firebase/init'
import button from '@/styles/button'
import { card } from '@/styles/media'
import { Icon } from '@iconify/react'
import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import { signOut } from 'firebase/auth'
import { useActionState } from 'react'

export const Route = createFileRoute('/user/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AuthGuard
      whenAbsent={<Navigate replace to='/auth' search={{ isLogin: true }} />}
      whenExists={<Page />}
    />
  )
}

function Page() {
  return (
    <section className={card()}>
      <UserProfile />
      <hr className='border-silver/10 w-full' />
      <div className='flex flex-wrap justify-center gap-2 **:text-sm'>
        <ResetPasswordButton />
        <VerifyEmailButton />
        <EditProfileButton />
      </div>
      <hr className='border-silver/10 w-full' />
      <LogoutButton />
    </section>
  )
}

function LogoutButton() {
  const [_, logout, isPending] = useActionState(async () => {
    await signOut(auth)
  }, null)

  return (
    <form action={logout} className='self-end pt-2'>
      <button
        disabled={isPending}
        className={button({ intent: 'destructive', hasIcon: true })}
        type='submit'
      >
        <Icon
          icon={isPending ? 'eos-icons:loading' : 'solar:logout-2-linear'}
        />
        Logout
      </button>
    </form>
  )
}

function ResetPasswordButton() {
  const { user } = useAuth()
  const [status, action, isPending] = useFireBaseAction(() =>
    sendResetPassword(user?.email ?? ''),
  )
  return (
    <form action={action}>
      <button
        disabled={isPending}
        className={button({ intent: 'success', hasIcon: true })}
      >
        <Icon icon='mdi:lock-reset' />
        {status.success ? 'Email Sent' : 'Reset Password'}
      </button>
    </form>
  )
}

function VerifyEmailButton() {
  const { user } = useAuth()
  const [Status, Action, Pending] = useFireBaseAction(sendEmailVerificationLink)
  if (user?.emailVerified) return null
  return (
    <form action={Action}>
      <button
        disabled={Pending}
        className={button({ intent: 'secondary', hasIcon: true })}
      >
        <Icon icon='material-symbols:verified' />
        {Status.success ? 'Email Sent' : 'Verify Email'}
      </button>
    </form>
  )
}

function EditProfileButton() {
  return (
    <Link
      to='/user/profile/edit'
      className={button({ intent: 'info', hasIcon: true })}
    >
      <Icon icon='mdi:account-edit' />
      Edit Profile
    </Link>
  )
}
