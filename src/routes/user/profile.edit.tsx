import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/profile/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/user/profile/edit"!</div>
}
