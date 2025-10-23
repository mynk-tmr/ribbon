import { VidSrc } from '@/components/molecules/VidSrc'
import { $medias } from '@/lib/indexdb/stores'
import { link } from '@/styles/typography'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/$media/$id/season/$num/$end/episode/$ep',
)({
  component: RouteComponent,
  async loader({ parentMatchPromise, params: { ep, num, id } }) {
    const episode = Number(ep)
    const out = (await parentMatchPromise).loaderData
    if (!out) throw new Error('No Data Provided from Parent Route')
    await $medias.updateTV({ id, season: Number(num), episode: Number(ep) })
    return { ...out, episode }
  },
})

function RouteComponent() {
  const { season, episode } = Route.useLoaderData()
  const { id } = Route.useParams()

  return (
    <main className='relative'>
      <VidSrc
        type='tv'
        id={id}
        season={season.season_number}
        episode={episode}
      />
      <div className='mx-auto w-fit'>
        <BackButton />
      </div>
    </main>
  )
}

function BackButton() {
  const { season } = Route.useLoaderData()
  const params = Route.useParams()
  return (
    <Link
      className={link()}
      replace
      to='/$media/$id/season/$num/$end'
      params={params}
    >
      &larr; Back to Season {season.season_number}
    </Link>
  )
}
