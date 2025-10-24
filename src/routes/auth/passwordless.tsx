import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/passwordless')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth/passwordless"!</div>
}
