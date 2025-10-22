export function prettifyFireAuthErrors(message: string): string {
  if (message.includes('auth/quota'))
    return 'This service is temporarily unavailable. Please try again later.'

  if (message.includes('auth/invalid-cred'))
    return 'Invalid Email or Password. Does the account exist?'
  const a = message.replace('Firebase: ', '').replaceAll('-', ' ')
  const b = a.replace(/(\(.*?\))/g, '')
  return b.length < 8 ? a : b
}
