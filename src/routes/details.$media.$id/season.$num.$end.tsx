import { Icon } from '@iconify/react'
import { Pagination } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { Episode } from '@/components/episode'
import Poster from '@/components/poster'
import { RatingCircle } from '@/components/rating-circle'
import { tmdb } from '@/config/tmdb'

export const Route = createFileRoute('/details/$media/$id/season/$num/$end')({
  component: RouteComponent,
  async loader({ params: { id, num } }) {
    const data = await tmdb.tv.season(id, Number(num))
    return { data }
  },
})

function RouteComponent() {
  const { data } = Route.useLoaderData()
  return (
    <main className="page space-y-16 pt-8 md:px-16">
      <SeasonDetails />
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.episodes.map((ep, i) => (
          <Episode index={i} key={ep.id} />
        ))}
      </section>
    </main>
  )
}

function SeasonDetails() {
  const { data: season } = Route.useLoaderData()
  const { num, end } = Route.useParams()
  const gto = Route.useNavigate()
  const goback = () => gto({ to: '/details/$media/$id/$similar', params: { similar: 1 } })
  return (
    <section className="grid gap-6 md:grid-cols-[300px_1fr]">
      <Poster className="object-contain" size="w500" path={season.poster_path} />
      <article className="space-y-9">
        <header className="flex items-center gap-6">
          <h2 className="text-4xl font-bold">{season.name}</h2>
          <RatingCircle
            size={52}
            strokeWidth={7}
            textSize="text-lg"
            rating={season.vote_average}
          />
        </header>
        <h3 className="text-xl">( {season.episodes.length} Episodes )</h3>
        <p>{season.overview}</p>
        <Pagination
          withControls={false}
          radius={'lg'}
          color="pink"
          value={Number(num)}
          total={Number(end)}
          onChange={(page) => {
            gto({ params: { num: `${page}` } })
          }}
        />
        <button onClick={goback} className="hover:text-pink-500" type="button">
          Go Back
          <Icon icon="mdi:arrow-left-bold-circle" className="inline ml-2" />
        </button>
      </article>
    </section>
  )
}
