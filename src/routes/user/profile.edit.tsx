import { Icon } from '@iconify/react'
import { Button, TextInput } from '@mantine/core'
import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import { updateProfile } from 'firebase/auth'
import { useFireAuthStore } from '@/hooks/useFireAuth'
import useFireBaseAction from '@/hooks/useFireBaseAction'
import { useMergedState } from '@/hooks/useMergedState'

export const Route = createFileRoute('/user/profile/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useFireAuthStore()
  const [state, update] = useMergedState({
    displayName: user?.displayName || '',
    photoURL: user?.photoURL || '',
  })
  const [status, action] = useFireBaseAction(() =>
    updateProfile(user!, {
      displayName: state.displayName,
      photoURL: state.photoURL,
    }),
  )
  if (!user) return

  if (status.success) return <Navigate to="/user/profile" replace />

  return (
    <section>
      <form action={action} className="space-y-4">
        <h2 className="text-2xl font-bold">Update Profile</h2>
        {status.error && (
          <p className="text-red-400 text-sm">{status.error.message}</p>
        )}
        <TextInput
          label="Display Name"
          value={state.displayName}
          leftSection={<Icon icon="mdi:robot-happy" />}
          onChange={(e) => update({ displayName: e.target.value })}
        />
        <TextInput
          label="Profile Pic"
          leftSection={<Icon icon="mdi:image" />}
          value={state.photoURL}
          onChange={(e) => update({ photoURL: e.target.value })}
        />
        <div className="flex justify-end gap-x-4">
          <Button
            loading={status.pending}
            disabled={status.pending}
            size="xs"
            color="green"
            type="submit"
          >
            Update
          </Button>
          <Button size="xs" color="yellow" component={Link} to="/user/profile">
            Cancel
          </Button>
        </div>
      </form>
    </section>
  )
}
