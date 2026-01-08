import { createFileRoute, redirect } from '@tanstack/react-router'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { firebaseAuth as auth } from '@/application/api/firebase/firebase.client'
import { authStoreActions } from '@/shared/hooks/useAuth'

export const Route = createFileRoute('/magic')({
  beforeLoad: async () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn')
      await signInWithEmailLink(auth, email!, window.location.href)
      window.localStorage.removeItem('emailForSignIn')
    } else {
      authStoreActions.refresh()
    }
    throw redirect({ to: '/user/profile', replace: true })
  },
})
