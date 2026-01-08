import { type } from 'arktype'

export const SendMagicLinkInput = type({ email: 'string.email' })

export const SendPasswordResetInput = type({ email: 'string.email' })

export const VerifyTokenInput = type({ token: 'string' })
