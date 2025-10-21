import { Poster } from '@/components/atoms/Poster'
import { RatingBadge } from '@/components/atoms/RatingBadge'
import { Episode } from '@/components/molecules/Episode'
import { Pagination } from '@/components/organisms/Pagination'
import { headings, text } from '@/styles/typography'
import { Icon } from '@iconify/react'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/$media/$id/season/$num/$end/')({
  component: RouteComponent,
  async loader({ parentMatchPromise }) {
    const out = (await parentMatchPromise).loaderData
    if (!out) throw new Error('No Data Provided from Parent Route')
    return out
  },
})

function RouteComponent() {
  const { season } = Route.useLoaderData()
  return (
    <main className='space-y-12'>
      <div>
        <GoBack />
        <SeasonDetails />
      </div>
      <section className='grid grid-cols-[repeat(auto-fill,minmax(225px,1fr))] gap-8'>
        {season.episodes.map((episode) => (
          <Episode key={episode.id} index={episode.episode_number - 1} />
        ))}
      </section>
    </main>
  )
}

function GoBack() {
  return (
    <Link
      to='/$media/$id/overview/$similar'
      className={`text-silver mb-4 flex items-center gap-3`}
      params={(p) => ({ media: p.media!, id: p.id!, similar: 1 })}
    >
      <Icon icon='material-symbols:arrow-back-rounded' /> Back to Series
    </Link>
  )
}

function SeasonDetails() {
  const { season } = Route.useLoaderData()
  return (
    <section className='grid min-h-[400px] gap-6 md:grid-cols-[300px_1fr]'>
      <Poster size='w500' path={season.poster_path} alt={season.name} />
      <article className='space-y-9'>
        <header className='flex items-center gap-6'>
          <h2 className={headings({ level: 'h2' })}>{season.name}</h2>
          <RatingBadge
            size={52}
            strokeWidth={7}
            textSize='text-lg'
            rating={season.vote_average}
            isAbsolute={false}
          />
        </header>
        <h3 className={headings({ level: 'h5', class: 'text-silver' })}>
          ( {season.episodes.length} Episodes )
        </h3>
        <p className={text({ as: 'body' })}>{season.overview}</p>
        <EpisodePagination />
      </article>
    </section>
  )
}

function EpisodePagination() {
  const { season, end } = Route.useLoaderData()
  const gto = Route.useNavigate()
  return (
    <Pagination
      circular
      showFirstAndLast={false}
      siblingCount={550}
      totalPages={end}
      currentPage={season.season_number}
      onChange={function (page) {
        gto({ params: { num: `${page}` } })
      }}
    />
  )
}
