import { createFileRoute } from '@tanstack/react-router'
import EntityGrid from '@/components/entity-grid'
import Overview from '@/components/overview'
import { type TMDB, tmdb } from '@/config/tmdb'

export const Route = createFileRoute('/details/$media/$id/$similar')({
  component: RouteComponent,
  params: { parse: ({ similar }) => ({ similar: Number(similar) || 1 }) },
  async loader({ params: { media, id, similar } }) {
    const [details, recommendations] = await Promise.all([
      tmdb.details<TMDB.MovieDetail | TMDB.TVDetail>(media, id),
      tmdb.similar(media, id, similar),
    ])
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
  const goto = Route.useNavigate()
  const changePage = (page: number) =>
    goto({ to: '.', params: { similar: page }, hash: 'recommendations' })
  return (
    // biome-ignore lint/correctness/useUniqueElementIds: for hash
    <section id="recommendations" className="mt-16">
      <EntityGrid head={() => `You may also like 😍`} items={data.results} />
      <EntityGrid.ChangePange
        total={data.total_pages}
        value={data.page}
        onChange={changePage}
      />
    </section>
  )
}
