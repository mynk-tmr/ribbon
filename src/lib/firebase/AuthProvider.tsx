import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { whenSignInLink } from './actions'
import { AuthContext, type AuthCtx } from './hooks'
import { auth } from './init'

export const AuthProvider = (props: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthCtx['user']>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    whenSignInLink()
  }, [])

  return <AuthContext value={{ user, loading }}>{props.children}</AuthContext>
}
