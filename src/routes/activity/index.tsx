import { Icon } from '@iconify/react'
import { Table } from '@mantine/core'
import { createFileRoute, Link } from '@tanstack/react-router'
import LikeButton from '@/components/like-button'
import PickStatus from '@/components/pick-status'
import Poster from '@/components/poster'
import { $myMedias, $searches, type MediaItem, useIDBStore } from '@/config/idb-store'
import { FmtDate } from '@/helpers/formatters'

export const Route = createFileRoute('/activity/')({ component: Page })

function Page() {
  return (
    <main className="p-4 max-w-6xl mx-auto space-y-14">
      <SearchHistory />
      <ContinueWatching />
      <AllMedias />
    </main>
  )
}

function SearchHistory() {
  const searches = useIDBStore($searches, (s) => s)
  return (
    <section>
      <h2 className="text-2xl font-bold mb-5 flex gap-2 items-center">
        <Icon icon="lucide:search-x" />
        Search History
      </h2>
      {searches.length < 1 && (
        <p className="text-sm text-gray-400">No search history found.</p>
      )}
      {searches.length > 0 && (
        <Table className="max-w-md" withRowBorders={false}>
          <Table.Thead className="bg-dark/50 border-white/10">
            <Table.Tr>
              <Table.Th>Query</Table.Th>
              <Table.Th>Entity</Table.Th>
              <Table.Th>Date</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {searches.map((s) => (
              <Table.Tr key={s.id}>
                <Table.Td>{s.query}</Table.Td>
                <Table.Td>{s.entity}</Table.Td>
                <Table.Td className="flex justify-between">
                  {FmtDate(s.addedAt)}
                  <button
                    title="Delete"
                    type="button"
                    className="cursor-pointer"
                    onClick={() => $searches.drop(s.id)}
                  >
                    <Icon icon="mdi:delete" className="text-red-400 text-lg" />
                  </button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
      <button
        className="mt-3 ml-3 cursor-pointer text-yellow-400 text-end text-sm"
        type="button"
        onClick={() => $searches.clear()}
      >
        Clear All History
      </button>
    </section>
  )
}

function ContinueWatching() {
  const items = useIDBStore(
    $myMedias,
    (s) => s.filter((m) => m.status === 'watching'),
    (a, b) => a.length === b.length,
  )
  return (
    <Template
      title={
        <>
          <Icon icon="mdi:play-box" />
          Continue Watching
        </>
      }
      subtitle="You have not added any media to watching list."
      items={items}
    />
  )
}

function AllMedias() {
  const items = useIDBStore($myMedias, (s) => s)
  return (
    <Template
      title={
        <>
          <Icon icon="mdi:playlist-play" />
          Your Media
        </>
      }
      subtitle="You have not added any media."
      items={items}
      showControls
    />
  )
}

function Template(props: {
  title: React.ReactNode
  subtitle: string
  items: Array<MediaItem>
  showControls?: boolean
}) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-5 flex gap-2 items-center">{props.title}</h2>
      {props.items.length < 1 && (
        <p className="text-sm text-gray-400">{props.subtitle}</p>
      )}
      <section className="flex gap-4 flex-wrap">
        {props.items.map((item) => (
          <article key={item.id} className="grid gap-2 relative">
            <LikeButton {...item} className="absolute top-0 right-0 z-10" />
            <Link
              target={item.media_type === 'tv' ? '' : '_blank'}
              from="/"
              to={item.link}
              className="relative"
            >
              <Poster
                transition
                path={item.poster_path}
                size="w342"
                className="sm:w-42 sm:h-36 size-34"
              />
              <span className="absolute bottom-0 text-xs font-medium px-1 bg-dark/80">
                {item.title}
                {item.parentTitle && ` (${item.parentTitle})`}
              </span>
            </Link>
            <div className="flex justify-center">
              {props.showControls && <PickStatus {...item} />}
            </div>
          </article>
        ))}
      </section>
    </section>
  )
}
