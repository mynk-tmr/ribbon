import { SearchFilterBox } from '@/components/organisms/SearchFilterBox'
import { SearchHistory } from '@/components/organisms/SearchHistory'
import { SearchResults } from '@/components/organisms/SearchResults'
import { $searches } from '@/lib/indexdb/stores'
import { tmdb } from '@/lib/tmdb/api'
import { headings } from '@/styles/typography'
import { createFileRoute } from '@tanstack/react-router'
import { type } from 'arktype'

const schema = type({
  query: 'string=""',
  media: '"movie" | "tv" = "tv"',
  page: 'number.integer = 1',
})

export const Route = createFileRoute('/search')({
  component: RouteComponent,
  validateSearch: schema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps: { query, media, page } }) => {
    if (query === '') return { data: null }
    await $searches.add({ query, media })
    const data = await tmdb[media].search({ query, page })
    return { data }
  },
})

function RouteComponent() {
  const { data } = Route.useLoaderData()
  return (
    <main className='mx-auto grid'>
      <SearchFilterBox />
      <SearchHistory />
      <section className='mt-8'>
        {data ? <SearchResults /> : <NoData />}
      </section>
    </main>
  )
}

function NoData() {
  return (
    <header className='mt-32 text-center opacity-45'>
      <h2 className={headings({ level: 'h3' })}>
        The results will appear here
      </h2>
    </header>
  )
}
