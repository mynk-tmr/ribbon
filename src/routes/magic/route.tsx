import { createFileRoute, redirect } from '@tanstack/react-router'
import { API } from '@/application/api'

export const Route = createFileRoute('/magic')({
  beforeLoad: async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')

    if (token) {
      try {
        // Verify the token with the server
        await API.passwordLess.verifyToken(token)
      } catch (error) {
        console.error('Failed to verify magic link:', error)
      }
    }
    throw redirect({ to: '/user/profile', replace: true })
  },
})
