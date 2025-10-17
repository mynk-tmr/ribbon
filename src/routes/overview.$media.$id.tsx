import { PreviewCard } from '@/components/molecules/PreviewCard'
import { MediaDetails } from '@/components/organisms/MediaDetails'
import { Pagination } from '@/components/organisms/Pagination'
import { tmdb } from '@/lib/tmdb/api'
import { headings } from '@/styles/typography'
import { createFileRoute, Link } from '@tanstack/react-router'
import { type } from 'arktype'

export const Route = createFileRoute('/overview/$media/$id')({
  component: RouteComponent,
  validateSearch: type({ similar: 'number.integer' }),
  loaderDeps({ search }) {
    return { search }
  },
  async loader({ params, deps: { search } }) {
    const { id, media } = type({
      id: 'string.integer.parse',
      media: "'tv' | 'movie'",
    }).assert(params)
    const [details, similar] = await Promise.all([
      tmdb[media].details(id),
      tmdb[media].recommendations(id, search.similar),
    ])

    return [details, similar] as const
  },
})

function RouteComponent() {
  const [details] = Route.useLoaderData()
  if (details.error || details.data === null) {
    return (
      <main className='mt-4 space-y-6'>
        <p>Error: {details.error?.status_message || 'Unknown Error'}</p>
      </main>
    )
  }
  return (
    <main className='mt-4'>
      <MediaDetails details={details.data} />
      <section className='px-4'>
        <header id='recommendations' className='my-12'>
          <span className={headings({ level: 'h3' })}>
            👀 You might also like
          </span>
        </header>
        <Recommendations />
      </section>
    </main>
  )
}

function Recommendations() {
  const [, similar] = Route.useLoaderData()
  const goto = Route.useNavigate()
  if (similar.error || similar.data === null) {
    return (
      <article>
        <p>
          Could not load similar:{' '}
          {similar.error?.status_message || 'Unknown Error'}
        </p>
      </article>
    )
  }

  if (similar.data.results.length == 0) {
    return (
      <article className='flex justify-center space-y-6'>
        <p
          className={headings({
            level: 'h5',
            className: 'text-silver opacity-80',
          })}
        >
          No similar found
        </p>
      </article>
    )
  }

  return (
    <section className='flex flex-col items-center gap-4'>
      <div className='mb-10 flex flex-wrap justify-center gap-6'>
        {similar.data.results.map((item) => (
          <Link
            className='max-w-40'
            key={item.id}
            to='/overview/$media/$id'
            params={{
              id: String(item.id),
              media: tmdb.isMovie(item) ? 'movie' : 'tv',
            }}
            search={{ similar: 1 }}
          >
            <PreviewCard item={item} />
          </Link>
        ))}
      </div>

      <Pagination
        totalPages={similar.data.total_pages}
        currentPage={similar.data.page}
        onChange={(p) => {
          goto({
            search: { similar: p },
            hash: 'recommendations',
            resetScroll: true,
          })
        }}
      />
    </section>
  )
}
