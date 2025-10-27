import { Icon } from '@iconify/react'
import { Divider } from '@mantine/core'
import { Await, createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import OverflowGrid from '@/components/overflow-grid'
import { tmdb } from '@/config/tmdb'

export const Route = createFileRoute('/discover/')({
  component: RouteComponent,
  async loader() {
    return {
      media: [
        tmdb.discover.movie('now_playing', 1),
        tmdb.discover.movie('top_rated', 1),
        tmdb.discover.movie('upcoming', 1),
        tmdb.discover.tv('airing_today', 1),
        tmdb.discover.tv('top_rated', 1),
        tmdb.discover.tv('popular', 1),
      ],
      people: tmdb.discover.person(1),
      movie: [
        tmdb.discover.movie('now_playing', 1),
        tmdb.discover.movie('top_rated', 1),
        tmdb.discover.movie('upcoming', 1),
      ],
    }
  },
})

function DivHeader(props: { icon: string; title: string }) {
  return (
    <Divider
      className="mt-10"
      labelPosition="center"
      label={
        <h2 className="text-3xl md:text-4xl font-bold justify-center flex gap-2 items-center">
          {props.title} <Icon icon={props.icon} />
        </h2>
      }
    />
  )
}

function RouteComponent() {
  const { movie, people } = Route.useLoaderData()
  const mvPrefix = ['Now Playing', 'Top Rated', 'Upcoming']
  const tvPrefix = ['Airing Today', 'Top Rated', 'Popular']
  return (
    <main className="px-4 max-w-7xl mx-auto space-y-10">
      <DivHeader icon="mdi:movie" title="Movies" />
      {movie.map((m, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: fine
        <section key={i}>
          <OverflowGrid.Heading title={mvPrefix[i]} />
          <Suspense fallback={<OverflowGrid.Skeleton />}>
            <Await promise={m}>
              {(m) => <OverflowGrid media={m.results} entity="movie" />}
            </Await>
          </Suspense>
        </section>
      ))}
      <DivHeader icon="mdi:television-box" title="TV Shows" />
      {movie.map((m, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: fine
        <section key={i}>
          <OverflowGrid.Heading title={tvPrefix[i]} />
          <Suspense fallback={<OverflowGrid.Skeleton />}>
            <Await promise={m}>
              {(m) => <OverflowGrid media={m.results} entity="tv" />}
            </Await>
          </Suspense>
        </section>
      ))}
      <DivHeader icon="mdi:robot-happy" title="People" />
      <Suspense fallback={<OverflowGrid.Skeleton />}>
        <Await promise={people}>
          {(people) => <OverflowGrid entity="person" people={people.results} />}
        </Await>
      </Suspense>
    </main>
  )
}
