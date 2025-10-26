import { Await, createFileRoute } from '@tanstack/react-router'
import OverflowGrid from '@/components/overflow-grid'
import { tmdb } from '@/config/tmdb'

export const Route = createFileRoute('/discover/')({
  component: RouteComponent,
  async loader() {
    return { movies: { now_playing: tmdb.discover.movie('now_playing', 1) } }
  },
})

function RouteComponent() {
  const {
    movies: { now_playing },
  } = Route.useLoaderData()
  return (
    <main className="pt-8 px-4 max-w-7xl mx-auto">
      <section>
        <OverflowGrid.Heading title="Now Playing Movies" />
        <Await promise={now_playing} fallback={<OverflowGrid.Skeleton />}>
          {(res) => (
            <OverflowGrid
              media={res.results}
              entity="movie"
              heading="Now Playing Movies"
            />
          )}
        </Await>
      </section>
    </main>
  )
}
