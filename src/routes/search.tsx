import { PreviewCard } from '@/components/molecules/PreviewCard'
import { Pagination } from '@/components/organisms/Pagination'
import { SearchFilterBox } from '@/components/organisms/SearchFilterBox'
import { tmdb, type TMDB } from '@/lib/tmdb/api'
import { headings } from '@/styles/typography'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/search')({
  component: RouteComponent,
  validateSearch: (search: TMDB.SearchParams & { media: 'movie' | 'tv' }) => {
    return Object.keys(search).length > 0
      ? search
      : {
          query: '',
          media: 'tv' as const,
          page: 1,
        }
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ deps: { query, media, page } }) => {
    if (query === '')
      return { data: { results: [], total_results: 0, total_pages: -1 } }
    const { data, error } = await tmdb[media].search({ query, page })
    if (error || !data) throw error
    return { data }
  },
})

function RouteComponent() {
  const { data } = Route.useLoaderData()
  const goto = Route.useNavigate()
  const search = Route.useSearch()
  const searchText = Object.values({ ...search, page: undefined }).join(' ')
  return (
    <main className='mx-auto grid max-w-7xl pt-8'>
      <SearchFilterBox
        defaults={{ ...search }}
        onSearch={(query, media, year) => {
          goto({
            search: { query, media, year, page: 1 },
          })
        }}
      />
      <section className='mt-8'>
        {search.query !== '' ? (
          <header>
            <h2 className={headings({ level: 'h3' })}>
              {data.total_results} results for <small>{searchText}</small>
            </h2>
          </header>
        ) : (
          <header className='mt-32 text-center opacity-45'>
            <h2 className={headings({ level: 'h3' })}>
              The results will appear here
            </h2>
          </header>
        )}
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
      </section>
    </main>
  )
}
