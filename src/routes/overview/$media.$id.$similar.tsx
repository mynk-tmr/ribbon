import { Pagination } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { createFileRoute, Link } from '@tanstack/react-router'
import { type } from 'arktype'
import { PreviewCard } from '@/components/preview-card'
import { type TMDB, tmdb } from '@/config/tmdb'

const schema = type({
  media: "'movie' | 'tv'",
  id: 'string.integer.parse',
  similar: 'string.integer.parse',
})

export const Route = createFileRoute('/overview/$media/$id/$similar')({
  component: RouteComponent,
  params: { parse: (raw) => schema.assert(raw) },
  async loader({ params: { media, id, similar } }) {
    const base = `/${media}/${id}`
    const p1 = tmdb.api(base)
    const p2 = tmdb.api(`${base}/recommendations?page=${similar}`)
    const [details, recommendations] = await Promise.all([p1, p2])
    return { details, recommendations }
  },
})

function RouteComponent() {
  const { details } = Route.useLoaderData()
  return (
    <main>
      <pre className="p-4 bg-black/20 text-sm whitespace-pre-wrap">
        {JSON.stringify({ details }, null, 2)}
      </pre>
      <Recommendations />
    </main>
  )
}

function Recommendations() {
  const { recommendations: data } = Route.useLoaderData()
  const { media } = Route.useParams()
  const goto = Route.useNavigate()
  const changePage = (page: number) =>
    goto({ to: '/overview/$media/$id/$similar', params: { similar: page } })
  const items = data.results as TMDB.Movie[] | TMDB.TV[]
  const isMatch = useMediaQuery('(min-width: 640px)')
  return (
    <section>
      <h1 className="text-2xl sm:text-3xl font-bold my-10 text-center">
        You may also like 😍
      </h1>
      <div className="flex flex-wrap gap-4 justify-center *:shrink-0">
        {items.map((item) => {
          return (
            <Link
              key={item.id}
              to="/overview/$media/$id/$similar"
              params={{ id: item.id, media, similar: 1 }}
            >
              <PreviewCard item={item} />
            </Link>
          )
        })}
      </div>
      <section className="mt-8 flex justify-center">
        <Pagination
          size={isMatch ? 'md' : 'xs'}
          value={data.page}
          total={data.total_pages}
          onChange={changePage}
        />
      </section>
    </section>
  )
}
