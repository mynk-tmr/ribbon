import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/user/profile/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  // Profile editing not available with MongoDB authentication
  // This feature used Firebase Auth's displayName and photoURL
  return <Navigate to="/user/profile" replace />
}
