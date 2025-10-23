import { tmdb } from '@/lib/tmdb/api'
import { headings } from '@/styles/typography'
import { getRouteApi, Link } from '@tanstack/react-router'
import { PreviewCard } from '../molecules/PreviewCard'
import { Pagination } from './Pagination'

export function SearchResults() {
  const Route = getRouteApi('/search')
  const { data } = Route.useLoaderData()
  if (!data) throw new Error('Route component has bad ternary')
  const search = Route.useSearch()
  const searchText = [
    `${data.total_pages} results for`,
    `"${search.query} / ${search.media}"`,
  ]
  const goto = Route.useNavigate()
  return (
    <>
      <header>
        <h2 className={headings({ level: 'h5', class: 'text-center' })}>
          {searchText[0]} <span className='text-teal'>{searchText[1]}</span>
        </h2>
      </header>
      <div className='mt-9 flex flex-wrap justify-center gap-4'>
        {data.results.map((item) => (
          <Link
            key={item.id}
            to='/$media/$id/overview/$similar'
            params={{
              id: item.id,
              media: tmdb.isMovie(item) ? 'movie' : 'tv',
              similar: 1,
            }}
          >
            <PreviewCard item={item} />
          </Link>
        ))}
      </div>
      <footer className='mt-8 flex justify-center'>
        {data.total_pages > 1 && (
          <Pagination
            currentPage={search.page || 1}
            totalPages={data.total_pages}
            onChange={(page) => {
              goto({ search: { ...search, page } })
            }}
          />
        )}
      </footer>
    </>
  )
}
