import { createFileRoute, Outlet } from '@tanstack/react-router'
import { type } from 'arktype'

const schema = type({ media: "'movie' | 'tv'", id: 'string.integer.parse' })

export const Route = createFileRoute('/$media/$id')({
  component: RouteComponent,
  params: { parse: (raw) => schema.assert(raw) },
})

function RouteComponent() {
  return <Outlet />
}
