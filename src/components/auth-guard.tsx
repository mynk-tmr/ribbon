import { Icon } from '@iconify/react'
import { useAuth } from '@/shared/hooks/useAuth'

export function AuthGuard(props: Props) {
  const state = useAuth()
  if (state.loading) return props.loader || <DefaultLoader />
  if (state.user) return props.authenticated
  return props.missing
}

type Props = {
  authenticated: React.ReactNode
  missing: React.ReactNode
  loader?: React.ReactNode
}

function DefaultLoader() {
  return (
    <div className="page min-w-xs flex flex-col items-center space-y-4">
      <Icon icon="eos-icons:hourglass" className="text-5xl" />
      <p>Verifying your identity ....</p>
    </div>
  )
}
