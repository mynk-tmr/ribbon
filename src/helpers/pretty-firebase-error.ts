function authErrors(message: string): string {
  if (message.includes('auth/quota') || message.includes('auth/too-many-requests'))
    return 'This service is temporarily unavailable. Please try again later.'

  if (message.includes('auth/invalid-cred')) return 'Invalid Email or Password'
  const a = message
    .replace('Firebase: ', '')
    .replaceAll('-', ' ')
    .replace('auth/', '')
    .replace(/[\s.]$/, '')
  const b = a.replace(/(\(.*?\))/g, '')
  return b.length < 8 ? a : b
}

export const firePrettify = { auth: authErrors }
