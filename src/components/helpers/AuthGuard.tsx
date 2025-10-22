import { useFireAuth } from '@/lib/firebase/store'
import { Icon } from '@iconify/react'

export type AuthGuardProps = {
  whenExists: React.ReactNode
  whenAbsent: React.ReactNode
  whenLoading?: React.ReactNode
}

export function AuthGuard(prop: AuthGuardProps) {
  const { user, loading } = useFireAuth()
  if (loading) return prop.whenLoading || <DefaultLoading />
  return user ? prop.whenExists : prop.whenAbsent
}

function DefaultLoading() {
  return (
    <div className='mx-auto grid h-[calc(100vh-200px)] max-w-[400px] place-content-center gap-4'>
      <Icon icon='eos-icons:hourglass' className='mx-auto text-5xl' />
      <span>Verifying your identity...</span>
    </div>
  )
}
