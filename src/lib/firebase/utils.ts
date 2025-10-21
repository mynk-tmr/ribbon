export function prettifyFireAuthErrors(message: string): string {
  if (message.includes('auth/missing-password')) return 'Missing password'
  if (message.includes('auth/password-does-not-meet-requirements'))
    return message.match(/\[(.*?)\]/)?.[1] || message
  else if (message.includes('auth/email-already-in-use'))
    return 'Email already in use'
  else if (message.includes('auth/invalid-email')) return 'Invalid email'
  else if (message.includes('auth/invalid-cred'))
    return 'Invalid Email or Password'
  else if (message.includes('auth/quota-'))
    return 'This service is temporarily unavailable. Please try again later.'
  else return message
}
