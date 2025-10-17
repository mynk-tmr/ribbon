import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$media/$id/season/$num')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$media/$id/season/$num"!</div>
}
