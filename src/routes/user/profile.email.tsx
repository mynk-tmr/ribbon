import { Icon } from '@iconify/react'
import { Button, PasswordInput, TextInput } from '@mantine/core'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
} from 'firebase/auth'
import { actionCodeSettings } from '@/config/firebase'
import { useFireAuthStore } from '@/hooks/useFireAuth'
import useFireBaseAction from '@/hooks/useFireBaseAction'
import { useMergedState } from '@/hooks/useMergedState'

export const Route = createFileRoute('/user/profile/email')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useFireAuthStore()
  const [state, update] = useMergedState({
    email: user?.email || '',
    password: '',
  })
  const [status, action] = useFireBaseAction(async () => {
    await reauthenticateWithCredential(
      user!,
      EmailAuthProvider.credential(user!.email!, state.password),
    )
    await verifyBeforeUpdateEmail(user!, state.email, actionCodeSettings)
  })
  if (!user) return

  if (status.success) return <VerifyEmailDisplay />

  return (
    <section>
      <form action={action} className="space-y-4">
        <h2 className="text-2xl font-bold">Update Email</h2>
        {status.error && (
          <p className="text-red-400 text-sm">{status.error.message}</p>
        )}
        <TextInput
          required
          label="Email"
          value={state.email}
          leftSection={<Icon icon="mdi:email" />}
          onChange={(e) => update({ email: e.target.value })}
        />
        <PasswordInput
          required
          label="Password"
          description="Password is required to update your email address"
          leftSection={<Icon icon="mdi:key" />}
          value={state.password}
          onChange={(e) => update({ password: e.target.value })}
        />
        <div className="flex justify-end gap-x-4">
          <Button loading={status.pending} size="xs" type="submit">
            Update
          </Button>
          <Button
            size="xs"
            color="gray.2"
            c="dark"
            component={Link}
            to="/user/profile"
          >
            Cancel
          </Button>
        </div>
      </form>
    </section>
  )
}

function VerifyEmailDisplay() {
  return (
    <section className="space-y-4 max-w-sm">
      <h2 className="text-2xl font-bold">Verify Email</h2>
      <p>
        Check new email for verification link. After verifying, you must log in
        again.
      </p>
      <div className="flex justify-end gap-x-4">
        <Button
          size="xs"
          color="blue"
          variant="outline"
          component={Link}
          to="/user/profile"
        >
          Go Back to Profile
        </Button>
      </div>
    </section>
  )
}
