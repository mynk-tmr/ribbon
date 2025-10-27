import { Icon } from '@iconify/react'
import { ActionIcon, ScrollArea } from '@mantine/core'
import type React from 'react'
import { useRef } from 'react'
import type { TMDB } from '@/config/tmdb'
import PersonCard from './person-card'
import PreviewCard from './preview-card'

type Props = {
  media?: (TMDB.Movie | TMDB.TV)[]
  entity: 'movie' | 'tv' | 'person'
  people?: TMDB.Person[]
}

export default function OverflowGrid(props: Props) {
  const { media = [], people = [], entity } = props

  const ref = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    const scrollable = ref.current
    if (scrollable) {
      const amount = scrollable.clientWidth * 0.8
      scrollable.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
    }
  }

  return (
    <section className="relative">
      <ActionIcon
        onClick={() => scroll('left')}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:block"
        radius={'xl'}
        size="xl"
        color="blue.8"
        opacity={0.65}
      >
        <Icon icon="mdi:arrow-left" />
      </ActionIcon>
      <ActionIcon
        onClick={() => scroll('right')}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10"
        radius={'xl'}
        size="xl"
        color="blue.8"
        opacity={0.65}
      >
        <Icon icon="mdi:arrow-right" />
      </ActionIcon>
      <ScrollArea viewportRef={ref} type="never">
        <div className="flex gap-4 *:shrink-0 *:w-44">
          {entity === 'person'
            ? people.map((person) => <PersonCard key={person.id} person={person} />)
            : media.map((item) => <PreviewCard key={item.id} item={item} />)}
        </div>
      </ScrollArea>
    </section>
  )
}

function Skeleton() {
  return (
    <div className="flex gap-4 overflow-x-hidden">
      {[...Array(8)].map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: fine
          key={i}
          className="w-40 shrink-0 rounded-xl overflow-hidden bg-gray-500 animate-pulse"
        >
          <div className="h-56 bg-gray-400" />
          <div className="p-2 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

type HeadingProps = { title: React.ReactNode }

export function Heading({ title }: HeadingProps) {
  return <h3 className="mb-5 text-2xl md:text-3xl font-bold capitalize">{title}</h3>
}

OverflowGrid.Skeleton = Skeleton
OverflowGrid.Heading = Heading
