import { Pagination, type PaginationProps } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import type { TMDB } from '@/config/tmdb'
import PersonCard from './person-card'
import PreviewCard from './preview-card'

type T = TMDB.Movie | TMDB.TV | TMDB.Person

interface Props {
  head: (t: T[]) => React.ReactNode
  items: T[]
  isPerson?: boolean
}

export default function EntityGrid(props: Props) {
  const { items, isPerson = false } = props
  items.sort((a, b) => b.popularity - a.popularity)
  return (
    <section className="space-y-12">
      <header>
        <h2 className="text-2xl text-center font-bold">{props.head(items)}</h2>
        <p className="text-sm mt-2 text-gray-400 text-center">
          This list is sorted by popularity.
        </p>
      </header>
      <div className="flex flex-wrap gap-4 justify-center *:w-36 *:md:w-44">
        {items.map((item) =>
          isPerson ? (
            <PersonCard key={item.id} person={item as TMDB.Person} />
          ) : (
            <PreviewCard key={item.id} item={item as TMDB.Movie | TMDB.TV} />
          ),
        )}
      </div>
    </section>
  )
}

function ChangePange(props: PaginationProps) {
  const isMobile = useMediaQuery('(max-width: 640px)')
  if (props.total)
    return (
      <section className="mt-8 flex justify-center">
        <Pagination size={isMobile ? 'xs' : 'md'} {...props} />
      </section>
    )
}

EntityGrid.ChangePange = ChangePange
