import { useFireBaseAction } from '@/hooks/useFireBaseAction'
import {
  sendEmailVerificationLink,
  sendResetPassword,
} from '@/lib/firebase/actions'
import { auth } from '@/lib/firebase/init'
import { useFireAuth } from '@/lib/firebase/store'
import { Icon } from '@iconify/react'
import { createFileRoute } from '@tanstack/react-router'
import { signOut } from 'firebase/auth'
import { cn } from 'tailwind-variants/lite'

export const Route = createFileRoute('/user/profile/')({ component: Page })

interface IAction {
  name: string
  action: () => Promise<void>
  onsuccess?: string
  onpending?: string
  icon: string
  disabled?: boolean
}

function Page() {
  const {
    USER: { emailVerified, email },
  } = useFireAuth()
  const goto = Route.useNavigate()

  const config: IAction[] = [
    emailVerified
      ? {
          name: 'Email is Verified',
          action: async () => void null,
          icon: 'mdi:check-circle',
          disabled: true,
        }
      : {
          name: 'Verify Email',
          action: () => sendEmailVerificationLink(),
          onsuccess: 'Email Sent',
          onpending: 'Sending Email',
          icon: 'material-symbols:verified',
        },
    {
      name: 'Reset Password',
      action: () => sendResetPassword(email!),
      onsuccess: 'Email Sent',
      onpending: 'Sending Email',
      icon: 'mdi:lock-reset',
    },
    {
      name: 'Edit Profile',
      action: () => goto({ to: '/user/profile/edit' }),
      icon: 'material-symbols:edit',
    },
    {
      name: 'Logout',
      action: async () => {
        const p = window.confirm('Do you want to logout?')
        if (p) signOut(auth)
      },
      icon: 'mdi:logout',
      onpending: 'Logging Out',
    },
  ]
  return (
    <section className='w-full'>
      <fieldset className='grid gap-y-4'>
        {config.map((item) => (
          <Action key={item.name} {...item} />
        ))}
      </fieldset>
    </section>
  )
}

function Action({
  name,
  icon,
  action,
  onsuccess = name,
  onpending = 'Working...',
  disabled = false,
}: IAction) {
  const [status, runAction, isPending] = useFireBaseAction(action)

  const display = () => {
    if (isPending) return onpending
    if (status.error) return status.error
    if (status.success) return onsuccess
    return name
  }
  return (
    <form action={runAction}>
      <button
        type='submit'
        disabled={disabled || isPending}
        className={cn(
          'flex items-center gap-2 hover:opacity-80 disabled:opacity-40',
          status.error && 'text-fireBrick',
        )}
      >
        <Icon icon={icon} />
        {display()}
      </button>
    </form>
  )
}
