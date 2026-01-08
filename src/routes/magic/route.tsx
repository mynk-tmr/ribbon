import { createFileRoute, redirect } from '@tanstack/react-router'
import { PasswordlessAPI } from '@/application/stores/api-store'
import { authStoreActions } from '@/shared/hooks/useAuth'

export const Route = createFileRoute('/magic')({
  beforeLoad: async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')

    if (token) {
      try {
        // Verify the token with the server
        await PasswordlessAPI.verifyToken(token)
      } catch (error) {
        console.error('Failed to verify magic link:', error)
      }
    } else {
      // Regular auth check
      await authStoreActions.refresh()
    }

    throw redirect({ to: '/user/profile', replace: true })
  },
})
