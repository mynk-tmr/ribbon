import { Chip } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { type } from 'arktype'
import EntityGrid from '@/components/entity-grid'
import { type TMDB, tmdb } from '@/config/tmdb'
import { FmtTitle } from '@/helpers/formatters'

const schema = type({
  domain: "'now_playing' | 'top_rated' | 'upcoming' | 'popular'",
  by: "'movie' | 'tv' | 'person'",
  page: 'string.integer.parse',
})

export const Route = createFileRoute('/discover/$domain/$by/$page')({
  component: RouteComponent,
  params: { parse: schema.assert },
  async loader({ params: { domain, by, page } }) {
    const data = await tmdb.discover<TMDB.Media | TMDB.Person>(by, domain, page)
    return { data }
  },
})

function RouteComponent() {
  const { data } = Route.useLoaderData()
  const { domain, by, page } = Route.useParams()
  const goto = Route.useNavigate()
  const changePage = (page: number) => goto({ params: { page } })
  return (
    <main className="page">
      <h1 className="text-3xl text-yellow-400 mb-4 font-bold text-center capitalize">
        {FmtTitle(domain)} {by}
      </h1>
      <EntityGrid
        controls={<Controls />}
        items={data.results}
        head={() => `Page ${page}`}
      />
      <EntityGrid.ChangePange
        total={data.total_pages}
        value={data.page}
        withPages={false}
        withEdges
        onChange={changePage}
      />
      <small className="block text-center mt-2">
        Showing page {data.page} of {data.total_pages}
      </small>
    </main>
  )
}

function Controls() {
  const { by, domain } = Route.useParams()
  const goto = Route.useNavigate()
  if (by !== 'person')
    return (
      <Chip.Group
        multiple={false}
        value={domain}
        onChange={(value) =>
          goto({ params: { domain: value as typeof domain, page: 1, by }, replace: true })
        }
      >
        <div className="flex gap-2 flex-wrap justify-center mt-2">
          <Chip value="upcoming">Upcoming</Chip>
          <Chip value="now_playing">Now Playing</Chip>
          <Chip value="top_rated">Top Rated</Chip>
          <Chip value="popular">Popular</Chip>
        </div>
      </Chip.Group>
    )
}
