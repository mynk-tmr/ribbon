import {
  EmailAuthProvider,
  isSignInWithEmailLink,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  verifyBeforeUpdateEmail,
} from 'firebase/auth'
import { auth } from './init'

export async function sendSignInLink(email: string) {
  await sendSignInLinkToEmail(auth, email, {
    url: `${window.location.origin}/magic/signIn`,
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

export async function changeEmail(email: string, password: string) {
  const user = auth.currentUser
  if (!user) throw new Error('No user is signed in.')

  const credential = EmailAuthProvider.credential(user.email!, password)
  await reauthenticateWithCredential(user, credential)

  // Sends verification link to the new email
  await verifyBeforeUpdateEmail(user, email, {
    url: `${window.location.origin}/magic/verifyEmail`,
    handleCodeInApp: true,
  })
}
