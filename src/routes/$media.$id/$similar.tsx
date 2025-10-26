import { Pagination } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { createFileRoute, Link } from '@tanstack/react-router'
import { type } from 'arktype'
import Overview from '@/components/overview'
import { PreviewCard } from '@/components/preview-card'
import { type TMDB, tmdb } from '@/config/tmdb'

export const Route = createFileRoute('/$media/$id/$similar')({
  component: RouteComponent,
  params: { parse: (raw) => type({ similar: 'string.integer.parse' }).assert(raw) },
  async loader({ params: { media, id, similar } }) {
    const p1 = tmdb.dispatch({ type: 'details', payload: { media, id } })
    const p2 = tmdb.dispatch<TMDB.Paginated<unknown>>({
      type: 'recommendations',
      payload: { media, id, page: similar },
    })
    const [details, recommendations] = await Promise.all([p1, p2])
    return { details, recommendations }
  },
})

function RouteComponent() {
  return (
    <main className="page pt-4">
      <Overview />
      <Recommendations />
    </main>
  )
}

function Recommendations() {
  const { recommendations: data } = Route.useLoaderData()
  const { media } = Route.useParams()
  const goto = Route.useNavigate()
  const changePage = (page: number) =>
    goto({
      to: '/$media/$id/$similar',
      params: { similar: page },
      hash: 'recommendations',
    })
  const items = data.results as TMDB.Movie[] | TMDB.TV[]
  const isMatch = useMediaQuery('(min-width: 640px)')
  return (
    // biome-ignore lint/correctness/useUniqueElementIds: for hash
    <section id="recommendations" className="mt-16">
      <h1 className="text-2xl sm:text-3xl font-bold mb-10 text-center">
        You may also like 😍
      </h1>
      <div className="flex flex-wrap gap-4 justify-center *:shrink-0">
        {items.map((item) => {
          return (
            <Link
              key={item.id}
              to="/$media/$id/$similar"
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
