import { Icon } from '@iconify/react'
import { Button, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'
import { sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth'
import { actionCodeSettings, auth } from '@/config/firebase'
import cn from '@/helpers/cn'
import { firePrettify } from '@/helpers/pretty-firebase-error'
import { useFireAuthSlice } from '@/hooks/useFireAuth'
import { useFormAction } from '@/hooks/useFormAction'

export const Route = createFileRoute('/user/profile/')({ component: RouteComponent })

function RouteComponent() {
  const { user } = useFireAuthSlice((state) => state)
  const goto = Route.useNavigate()
  const [opened, { open: openSignOut, close }] = useDisclosure(false)
  if (!user) return

  const actions: ActionProps[] = [
    {
      label: 'Reset Password',
      action: () => sendPasswordResetEmail(auth, user.email!, actionCodeSettings),
      icon: 'mdi:lock-reset',
      successLabel: 'Email Sent',
    },
    {
      label: 'Edit Profile',
      action: () => goto({ to: '/user/profile/edit', replace: true }),
      icon: 'mdi:account-edit',
    },
    {
      label: 'Change Email',
      action: () => goto({ to: '/user/profile/email', replace: true }),
      icon: 'mdi:email-edit',
    },
    { label: 'Sign Out', action: async () => openSignOut(), icon: 'mdi:logout' },
  ]

  if (!user.emailVerified)
    actions.unshift({
      label: 'Verify Email',
      action: () => sendEmailVerification(user, actionCodeSettings),
      icon: 'mdi:email-check',
      successLabel: 'Email Sent',
    })
  else
    actions.unshift({
      label: 'Email is Verified',
      action: async () => null,
      icon: 'mdi:check-circle',
      disabled: true,
    })

  return (
    <>
      <div>
        {actions.map((action) => (
          <ActionItem key={action.label} {...action} />
        ))}
      </div>
      <Modal size={'xs'} opened={opened} onClose={close} title="Sign Out" centered>
        <p className="mb-4 text-neutral-400">
          Are you sure you want to sign out? This will end your current session.
        </p>
        <Button size="xs" color="red" onClick={() => auth.signOut()}>
          Sign Out
        </Button>
      </Modal>
    </>
  )
}

type ActionProps = {
  label: string
  action: () => Promise<unknown>
  icon: string
  successLabel?: string
  disabled?: boolean
}

function ActionItem(props: ActionProps) {
  const [status, start] = useFormAction(props.action)
  return (
    <form action={start}>
      <button
        type="submit"
        disabled={props.disabled || status.pending}
        className={cn.filter(
          'flex items-center text-white gap-2 w-full p-2 rounded-md hover:bg-black/30',
          props.successLabel && status.success && 'text-green-400',
          status.error && 'text-red-400',
          props.disabled && 'opacity-50 pointer-events-none',
        )}
      >
        <Icon icon={props.icon} />
        {cn.first(
          status.success && props.successLabel,
          status.error && firePrettify.auth(status.error.message),
          props.label,
        )}
        <div>
          {props.successLabel && status.success && (
            <Icon icon="mdi:check-circle-outline" />
          )}
          {status.error && <Icon icon="mdi:alert-circle-outline" />}
          {status.pending && <Icon icon="eos-icons:loading" />}
        </div>
      </button>
    </form>
  )
}
