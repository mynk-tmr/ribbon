import { useFireAuth } from '@/lib/firebase/store'
import { DefaultLoading } from './DefaultLoading'

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
