import { createFileRoute } from '@tanstack/react-router'
import { tmdb } from '@/application/api/tmdb/tmdb.client'
import EntityGrid from '@/components/entity-grid'
import Overview from '@/components/overview'

export const Route = createFileRoute('/details/$media/$id/$similar')({
  component: RouteComponent,
  params: { parse: ({ similar }) => ({ similar: Number(similar) || 1 }) },
  async loader({ params: { media, id, similar }, parentMatchPromise }) {
    const [details, recommendations] = await Promise.all([
      (await parentMatchPromise).loaderData,
      tmdb.similar(media, id, similar),
    ])
    if (details === undefined) throw new Error('parentMatchPromise failed')
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
