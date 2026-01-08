import { Icon } from '@iconify/react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { AuthAPI } from '@/application/stores/api-store'
import { authStore, authStoreActions } from '@/application/stores/auth.store'
import { useFormAction } from '@/shared/hooks/useFormAction'

export const Route = createFileRoute('/user/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  const user = authStore.value.user
  const router = useRouter()

  if (!user) return null

  const actions: ActionProps[] = [
    {
      label: 'Sign Out',
      action: async () => {
        await AuthAPI.logout()
        await authStoreActions.refresh()
        router.invalidate()
      },
      icon: 'mdi:logout',
    },
  ]

  return (
    <div>
      <p className="text-neutral-400 mb-4">Signed in as: {user.email}</p>
      {actions.map((action) => (
        <ActionItem key={action.label} {...action} />
      ))}
    </div>
  )
}

type ActionProps = {
  label: string
  action: () => Promise<unknown>
  icon: string
}

function ActionItem(props: ActionProps) {
  const [status, start] = useFormAction(props.action)
  return (
    <form action={start}>
      <button
        type="submit"
        disabled={status.pending}
        className="flex items-center text-white gap-2 w-full p-2 rounded-md hover:bg-black/30 disabled:opacity-50 disabled:pointer-events-none"
      >
        <Icon icon={props.icon} />
        {props.label}
        {status.pending && <Icon icon="eos-icons:loading" />}
      </button>
    </form>
  )
}
