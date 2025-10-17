import { createFileRoute, Outlet } from '@tanstack/react-router'
import { type } from 'arktype'

export const Route = createFileRoute('/$media/$id')({
  component: Outlet,
  params: {
    parse: (raw) => {
      const { id, media } = type({
        id: 'string.integer.parse',
        media: "'tv' | 'movie'",
      }).assert(raw)
      return { id, media }
    },
  },
})
