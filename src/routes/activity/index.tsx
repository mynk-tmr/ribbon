import { Pill } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { createFileRoute, Link } from '@tanstack/react-router'
import BigDivider from '@/components/big-divider'
import PlanFavorite from '@/components/plan-favorite'
import Poster from '@/components/poster'
import { $myMedias, $searches, type MediaItem, useIDBStore } from '@/config/idb-store'
import cn from '@/helpers/cn'
import { FmtTrunc } from '@/helpers/formatters'

export const Route = createFileRoute('/activity/')({ component: RouteComponent })

function RouteComponent() {
  return (
    <main className="px-4 space-y-10 *:space-y-4">
      <section>
        <BigDivider icon="mdi:search-web" title="Search History" />
        <SearchHistory />
      </section>
      <section>
        <BigDivider icon="mdi:play-box" title="Continue Watching" />
        <ContinueWatching />
      </section>
      <section>
        <BigDivider icon="mdi:emoticon-happy" title="All Media" />
        <AllMedia />
      </section>
    </main>
  )
}

function SearchHistory() {
  const searches = useIDBStore($searches, (s) => s)
  return (
    <section className="flex flex-wrap gap-4 justify-center">
      {searches.map((s) => (
        <Pill
          size="md"
          withRemoveButton
          onRemove={() => {
            $searches.drop(s.id)
          }}
          key={s.id}
        >
          {s.query} ({s.entity})
        </Pill>
      ))}
    </section>
  )
}

function ContinueWatching() {
  const media = useIDBStore(
    $myMedias,
    (s) => s.filter((m) => m.status === 'watching'),
    (old, neo) => old.length === neo.length,
  )
  return <Grid items={media} />
}

function AllMedia() {
  const media = useIDBStore($myMedias, (s) => s)
  const sorted = [...media].sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
  return <Grid items={sorted} />
}

function Grid(props: { items: MediaItem[] }) {
  const isMobile = useMediaQuery('(max-width: 576px)')
  return (
    <section className="flex flex-wrap gap-4 justify-center">
      {props.items.map((e) => (
        <section
          key={e.id}
          className={cn.filter('space-y-2 relative w-50', isMobile && 'w-36')}
        >
          <Poster size="w342" path={e.poster_path} className="h-30" />
          <Link
            to={e.link}
            target={e.link.startsWith('http') ? '_blank' : '_self'}
            className="text-sm font-medium text-neutral-400 hover:text-pink-400"
          >
            {FmtTrunc(e.title, 20)} {e.parentTitle && `(${e.parentTitle})`}🔗
          </Link>
          <PlanFavorite {...e} className="absolute top-0 w-full justify-between" />
        </section>
      ))}
    </section>
  )
}
