import { createFileRoute, Outlet } from '@tanstack/react-router'
import { type } from 'arktype'
import { type TMDB, tmdb } from '@/config/tmdb'

const schema = type({ media: '"movie" | "tv"', id: 'string.integer.parse' })

export const Route = createFileRoute('/details/$media/$id')({
  component: RouteComponent,
  params: { parse: (raw) => schema.assert(raw) },
  async loader({ params: { media, id } }) {
    const details = await tmdb.details<TMDB.MovieDetail | TMDB.TVDetail>(
      media,
      id,
    )
    return { details }
  },
})

function RouteComponent() {
  return <Outlet />
}
