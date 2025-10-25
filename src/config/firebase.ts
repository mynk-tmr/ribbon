import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

export const app = initializeApp({
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
})

export const auth = getAuth(app)

export const actionCodeSettings = {
  url: `${window.location.origin}/magic/done`,
  handleCodeInApp: true,
}
