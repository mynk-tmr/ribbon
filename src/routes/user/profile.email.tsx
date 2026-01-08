import { Icon } from '@iconify/react'
import { Button, PasswordInput, TextInput } from '@mantine/core'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
} from 'firebase/auth'
import { actionCodeSettings } from '@/application/api/firebase/firebase.client'
import { authStoreActions } from '@/shared/hooks/useAuth'
import useFireBaseAction from '@/shared/hooks/useFireBaseAction'
import { useMergedState } from '@/shared/hooks/useMergedState'

export const Route = createFileRoute('/user/profile/email')({
  component: RouteComponent,
})

function RouteComponent() {
  const firebaseUser = authStoreActions.getFirebaseUser()
  const [state, update] = useMergedState({
    email: firebaseUser?.email || '',
    password: '',
  })
  const [status, action] = useFireBaseAction(async () => {
    if (!firebaseUser) return
    await reauthenticateWithCredential(
      firebaseUser,
      EmailAuthProvider.credential(firebaseUser.email!, state.password),
    )
    await verifyBeforeUpdateEmail(firebaseUser, state.email, actionCodeSettings)
  })

  if (!firebaseUser) return null
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
