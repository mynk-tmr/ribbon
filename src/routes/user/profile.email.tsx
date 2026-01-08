import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/user/profile/email')({
  component: RouteComponent,
})

function RouteComponent() {
  // Email update not available with MongoDB authentication
  // This feature used Firebase Auth's email verification
  return <Navigate to="/user/profile" replace />
}
