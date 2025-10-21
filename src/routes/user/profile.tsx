import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/user/profile')({ component: Outlet })
