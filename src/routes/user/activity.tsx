import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/activity')({
  component: RouteComponent,
})

function RouteComponent() {
  return <main>Coming Soon</main>
}
