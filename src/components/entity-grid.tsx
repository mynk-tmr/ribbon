import { Pagination, type PaginationProps } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import type { TMDB } from '@/config/tmdb'
import PreviewCard from './preview-card'

type T = TMDB.Media | TMDB.Person

interface Props {
  head: (t: T[]) => React.ReactNode
  items: T[]
  controls?: React.ReactNode
}

export default function EntityGrid(props: Props) {
  const items = [...props.items]
  items.sort((a, b) => b.popularity - a.popularity)
  return (
    <section className="space-y-12">
      <header>
        <h2 className="text-2xl text-center font-bold">{props.head(items)}</h2>
        <p className="text-sm mt-2 text-gray-400 text-center">
          This list is sorted by popularity.
        </p>
        {props.controls && (
          <div className="flex mt-3 justify-center">{props.controls}</div>
        )}
      </header>
      <div className="flex *:shrink-0 flex-wrap gap-4 justify-center *:w-38 *:md:w-44">
        {items.length === 0 && (
          <p className="text-center text-gray-400">No results found.</p>
        )}
        {items.length > 0 &&
          items.map((item) => <PreviewCard key={item.id} item={item} />)}
      </div>
    </section>
  )
}

function ChangePange(props: PaginationProps) {
  const isMobile = useMediaQuery('(max-width: 640px)')
  if (props.total)
    return (
      <section className="mt-8 flex justify-center">
        <Pagination itemProp="" size={isMobile ? 'sm' : 'md'} {...props} />
      </section>
    )
}

EntityGrid.ChangePange = ChangePange
