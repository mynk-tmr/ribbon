import { Icon } from '@iconify/react'
import { useStore } from '@nanostores/react'
import { createFileRoute } from '@tanstack/react-router'
import CardMediaItem from '@/components/card-media-item'
import SearchHistory from '@/components/search-history'
import { MyMedias } from '@/config/idb-store'

export const Route = createFileRoute('/activity/')({ component: Page })

function Page() {
  return (
    <main className="px-4 pt-8 max-w-6xl mx-auto space-y-14">
      <Container title="Search History" icon="mdi:history">
        <SearchHistory />
      </Container>
      <ContinueWatching />
      <AllMedias />
    </main>
  )
}

function Container(props: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-5 flex gap-2 items-center">
        <Icon icon={props.icon} />
        {props.title}
      </h2>
      <section className="flex gap-4 flex-wrap pb-4">{props.children}</section>
    </section>
  )
}

function ContinueWatching() {
  const items = useStore(MyMedias.store)
  const watchingItems = items.filter((i) => i.status === 'watching')
  return (
    <Container title="Continue Watching" icon="mdi:play-circle">
      {watchingItems.map((item) => (
        <CardMediaItem key={item.id} {...item} />
      ))}
      {watchingItems.length === 0 && (
        <p className="text-sm text-gray-400">No items to continue watching.</p>
      )}
    </Container>
  )
}

function AllMedias() {
  const items = useStore(MyMedias.store)
  return (
    <Container title="My Media" icon="mdi:list-box">
      {items.map((item) => (
        <CardMediaItem key={item.id} {...item} />
      ))}
      {items.length === 0 && (
        <p className="text-sm text-gray-400">No media found in your collection.</p>
      )}
    </Container>
  )
}
