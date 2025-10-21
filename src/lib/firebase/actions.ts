import {
  isSignInWithEmailLink,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  updateEmail,
  updateProfile,
} from 'firebase/auth'
import { auth } from './init'

export async function sendSignInLink(email: string) {
  await sendSignInLinkToEmail(auth, email, {
    url: window.location.origin,
    handleCodeInApp: true,
  })
  window.localStorage.setItem('emailForSignIn', email)
}

export async function whenSignInLink() {
  //if incoming link is sign in link then sign in
  if (!isSignInWithEmailLink(auth, window.location.href)) return
  const email = window.localStorage.getItem('emailForSignIn')
  if (email) {
    await signInWithEmailLink(auth, email, window.location.href)
    window.localStorage.removeItem('emailForSignIn')
  } else throw new Error('No email saved in localStorage')
}

export async function sendResetPassword(email: string) {
  await sendPasswordResetEmail(auth, email, {
    url: `${window.location.origin}/magic/resetPassword`,
    handleCodeInApp: true,
  })
}

export async function sendEmailVerificationLink() {
  if (!auth.currentUser) throw new Error('No signed-in user')
  await sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/magic/verifyEmail`,
    handleCodeInApp: true,
  })
}

export async function updateUserInfo(updates: {
  email?: string
  displayName?: string
  photoURL?: string
}) {
  const user = auth.currentUser
  if (!user) throw new Error('No user signed in')
  const tasks: Promise<void>[] = []

  // Profile fields
  if (updates.displayName || updates.photoURL) {
    tasks.push(
      updateProfile(user, {
        displayName: updates.displayName ?? user.displayName,
        photoURL: updates.photoURL ?? user.photoURL,
      }),
    )
  }

  // Email change (this will require re-auth if sensitive)
  if (updates.email && updates.email !== user.email) {
    tasks.push(updateEmail(user, updates.email))
  }

  await Promise.all(tasks)
  await user.reload()
  return user
}
