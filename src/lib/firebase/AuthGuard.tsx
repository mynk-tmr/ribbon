import { useAuth } from './hooks'

export type AuthGuardProps = {
  whenExists: React.ReactNode
  whenAbsent: React.ReactNode
  whenLoading?: React.ReactNode
}

export function AuthGuard(prop: AuthGuardProps) {
  const { user, loading } = useAuth()
  if (loading) return prop.whenLoading || null
  return user ? prop.whenExists : prop.whenAbsent
}
