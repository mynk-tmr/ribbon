import { Icon } from '@iconify/react'
import { Button, Pagination, Select, TextInput } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { createFileRoute, Link } from '@tanstack/react-router'
import { type } from 'arktype'
import PersonCard from '@/components/person-card'
import { PreviewCard } from '@/components/preview-card'
import { type TMDB, tmdb } from '@/config/tmdb'
import { useMergedState } from '@/hooks/useMergedState'

const schema = type({
  query: 'string',
  by: "'movie' | 'tv' | 'person'",
  page: 'number.integer > 0',
})

export const Route = createFileRoute('/search/')({
  component: RouteComponent,
  validateSearch: schema,
  loaderDeps: ({ search }) => ({ search }),
  async loader({ deps: { search } }) {
    if (search.query === '') return { data: { results: [], page: 1, total_pages: 1 } }
    const data = await tmdb.dispatch<TMDB.Paginated<unknown>>({
      type: 'search',
      payload: search,
    })
    return { data }
  },
})

function RouteComponent() {
  const { data } = Route.useLoaderData()
  return (
    <main className="mt-8 px-4 sm:px-8">
      <SearchBox />
      {data.results.length > 0 ? <Results /> : <NoResults />}
    </main>
  )
}

function NoResults() {
  const { query, by } = Route.useSearch()
  const heading = query === '' ? 'Results will appear here' : 'No results found'
  return (
    <section className="mt-8 grid justify-center">
      <h1 className="text-3xl text-zinc-600 font-bold mb-6">{heading}</h1>
      {query !== '' && (
        <p className="text-lg">
          Query:{' '}
          <b className="text-yellow-400">
            {query} {by}
          </b>
        </p>
      )}
    </section>
  )
}

function SearchBox() {
  const { query, by } = Route.useSearch()
  const [state, update] = useMergedState({ query, by })
  const goto = Route.useNavigate()
  const search = () => goto({ to: '/search', search: { ...state, page: 1 } })
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        search()
      }}
      className="flex flex-wrap gap-6 justify-center"
    >
      <TextInput
        value={state.query}
        onChange={(e) => update({ query: e.target.value })}
        leftSection={<Icon icon="mdi:magnify" />}
        miw={300}
        required
        placeholder="Search movies, tv series and people"
        type="search"
        radius="xl"
      />
      <Select
        value={state.by}
        onChange={(value) => update({ by: value as typeof by })}
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

function Results() {
  const { data } = Route.useLoaderData()
  const { query, by, page } = Route.useSearch()
  const items =
    by === 'person'
      ? (data.results as TMDB.Person[]).map((person) => (
          <Link key={person.id} to="/person/$id" params={{ id: person.id }}>
            <PersonCard person={person} />
          </Link>
        ))
      : (data.results as TMDB.Movie[] | TMDB.TV[]).map((item) => (
          <Link
            key={item.id}
            to="/$media/$id/$similar"
            params={{ id: item.id, media: by === 'movie' ? 'movie' : 'tv', similar: 1 }}
          >
            <PreviewCard item={item} />
          </Link>
        ))

  return (
    <section>
      <h1 className="text-3xl font-bold my-10 text-center">
        Results for{' '}
        <b className="text-yellow-400">
          {query} {by}
        </b>{' '}
        <small className="text-base">
          ({page} / {data.total_pages})
        </small>
      </h1>
      <div className="flex flex-wrap gap-4 justify-center *:shrink-0">{items}</div>
      <ChangePange />
    </section>
  )
}

function ChangePange() {
  const search = Route.useSearch()
  const {
    data: { total_pages },
  } = Route.useLoaderData()
  const goto = Route.useNavigate()
  const changePage = (page: number) => goto({ to: '.', search: { ...search, page } })
  const isMobile = useMediaQuery('(max-width: 640px)')
  return (
    <section className="mt-8 flex justify-center">
      <Pagination
        size={isMobile ? 'xs' : 'md'}
        value={search.page}
        total={total_pages}
        onChange={changePage}
      />
    </section>
  )
}
