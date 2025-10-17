import { VidSrc } from '@/components/molecules/VidSrc'
import { link } from '@/styles/typography'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/$media/$id/season/$num/$end/episode/$ep',
)({
  component: RouteComponent,
  async loader({ parentMatchPromise, params: { ep } }) {
    const episode = Number(ep)
    const out = (await parentMatchPromise).loaderData
    if (!out) throw new Error('No Data Provided from Parent Route')
    return { ...out, episode }
  },
})

function RouteComponent() {
  const { season, episode } = Route.useLoaderData()
  const { id } = Route.useParams()
  return (
    <main className='px-6 pt-8'>
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
      className={link({
        class: 'hover:border-b-lightGray hover:border-b',
      })}
      replace
      to='/$media/$id/season/$num/$end'
      params={params}
    >
      &larr; Back to Season {season.season_number}
    </Link>
  )
}
