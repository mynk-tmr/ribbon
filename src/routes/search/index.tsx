import { Icon } from '@iconify/react'
import { Autocomplete, Button, Select } from '@mantine/core'
import { useStore } from '@nanostores/react'
import { createFileRoute } from '@tanstack/react-router'
import { type } from 'arktype'
import { type TMDB, tmdb } from '@/application/api/tmdb/tmdb.client'
import { searchStore } from '@/application/stores/search.store'
import EntityGrid from '@/components/entity-grid'
import type { SearchItem } from '@/domain/entities'
import { useMergedState } from '@/shared/hooks/useMergedState'

const schema = type({
  query: "string = ''",
  by: "'movie' | 'tv' | 'person' = 'tv'",
  page: 'number.integer > 0 = 1',
})

export const Route = createFileRoute('/search/')({
  component: RouteComponent,
  validateSearch: (s) => schema.assert(s),
  loaderDeps: ({ search }) => ({ search }),
  async loader({
    deps: {
      search: { query, by, page },
    },
  }) {
    if (query === '') return { data: 'NEVER' } as const
    const data = await tmdb.search<TMDB.Media | TMDB.Person>(by, query, page)
    return { data }
  },
})

function RouteComponent() {
  const { data } = Route.useLoaderData()
  const { query, by } = Route.useSearch()
  const tw_heading = 'text-3xl text-zinc-600 font-bold mb-6'

  const search = Route.useSearch()
  const goto = Route.useNavigate()
  const changePage = (page: number) =>
    goto({ to: '.', search: { ...search, page } })

  let BODY = null

  if (data === 'NEVER')
    BODY = <h1 className={tw_heading}>Results will appear here</h1>
  else if (data.results.length === 0)
    BODY = (
      <div className="space-y-4">
        <h1 className={tw_heading}>No results found</h1>
        <p className="text-lg">
          Query:{' '}
          <b className="text-yellow-400">
            {query} {by}
          </b>
        </p>
      </div>
    )
  else
    BODY = (
      <EntityGrid
        items={data.results}
        head={(i) => (
          <header>
            <h1 className={tw_heading}>
              {i.length} results found for{' '}
              <b className="text-yellow-400">
                {query} {by}
              </b>
            </h1>
          </header>
        )}
      />
    )

  return (
    <main className="mt-8 px-4 sm:px-8 space-y-8">
      <SearchBox />
      <section className="mt-8 grid justify-center">{BODY}</section>
      {data !== 'NEVER' && data.total_pages > 1 && (
        <EntityGrid.ChangePange
          value={data.page}
          total={data.total_pages}
          onChange={changePage}
        />
      )}
    </main>
  )
}

type Entity = 'movie' | 'tv' | 'person'

function SearchBox() {
  const sparam = Route.useSearch()
  const [state, update] = useMergedState(sparam)
  const searches = useStore(searchStore.store)
  const goto = Route.useNavigate()
  const search = () => goto({ to: '/search', search: { ...state, page: 1 } })
  const getFiltered = (entity: Entity) =>
    (searches as SearchItem[])
      .filter((s) => s.entity === entity)
      .map((s) => `${s.query} (${entity})`) //this pattern is used by regex in autocomplete
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const { query, by } = state
        await searchStore.add(query, by)
        search()
      }}
      className="flex flex-wrap gap-6 justify-center"
    >
      <Autocomplete
        data={[
          { group: 'Movies', items: getFiltered('movie') },
          { group: 'TV Series', items: getFiltered('tv') },
          { group: 'People', items: getFiltered('person') },
        ]}
        value={state.query}
        onChange={(v) => {
          const match = v.match(/^(.*) \((.*)\)$/)
          if (match) update({ query: match[1], by: match[2] as Entity })
          else update({ query: v })
        }}
        leftSection={<Icon icon="mdi:magnify" />}
        miw={300}
        required
        placeholder="Search movies, tv series and people"
        radius="xl"
        clearable
      />
      <Select
        value={state.by}
        onChange={(value) => update({ by: value as Entity })}
        placeholder="Type"
        required
        data={[
          { label: '🎥 Movies', value: 'movie' },
          { label: '📺 TV Series', value: 'tv' },
          { label: '🧑‍🎨 Artist', value: 'person' },
        ]}
        maw={150}
      />
      <Button type="submit" size="xs">
        Search
      </Button>
    </form>
  )
}
