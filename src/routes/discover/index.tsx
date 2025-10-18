import { Skeleton } from '@/components/atoms/Skeleton'
import { HorizontalScroller } from '@/components/molecules/HorizontalScroller'
import { PreviewCard } from '@/components/molecules/PreviewCard'
import { tmdb } from '@/lib/tmdb/api'
import { headings } from '@/styles/typography'
import { Await, createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/discover/')({
  component: RouteComponent,
  async loader() {
    return [
      tmdb.movie.trending('week'),
      tmdb.movie.popular(1),
      tmdb.movie.top_rated(1),
      tmdb.tv.trending('week'),
      tmdb.tv.popular(1),
      tmdb.tv.top_rated(1),
    ] as const
  },
})

function RouteComponent() {
  const promises = Route.useLoaderData()
  const headers = [
    '🔥Trending Movies',
    '🙈 Popular Movies',
    '🌟 Top Rated Movies',
    '🔥Trending Series',
    '🙈 Popular Series',
    '🌟 Top Rated Series',
  ]
  return (
    <main className='space-y-10'>
      {promises.map((p, i) => (
        <section key={i}>
          <h2 className={headings({ level: 'h3', className: 'mb-4' })}>
            {headers[i]}
          </h2>
          <Await
            /* @ts-expect-error p is movie or tv */
            promise={p}
            fallback={
              <div className='min-h-[204px] py-5'>
                <Skeleton />
              </div>
            }
          >
            {(data) => (
              <HorizontalScroller items={data.results}>
                {(item) => (
                  <Link
                    key={item.id}
                    to='/$media/$id/overview/$similar'
                    params={{
                      media: headers[i].endsWith('ovies') ? 'movie' : 'tv',
                      id: item.id,
                      similar: 1,
                    }}
                  >
                    <PreviewCard item={item} />
                  </Link>
                )}
              </HorizontalScroller>
            )}
          </Await>
        </section>
      ))}
    </main>
  )
}
