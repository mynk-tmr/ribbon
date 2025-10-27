import { createFileRoute, redirect } from '@tanstack/react-router'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { authStore } from '@/hooks/useFireAuth'

export const Route = createFileRoute('/magic')({
  beforeLoad: async () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn')
      await signInWithEmailLink(auth, email!, window.location.href)
      window.localStorage.removeItem('emailForSignIn')
    } else {
      await authStore.refresh()
    }
    throw redirect({ to: '/user/profile', replace: true })
  },
})
