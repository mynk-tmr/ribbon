import { Icon } from '@iconify/react'
import { Tabs } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { useStore } from '@nanostores/react'
import { createFileRoute } from '@tanstack/react-router'
import { type } from 'arktype'
import { mediaStore } from '@/application/stores/media.store'
import CardMediaItem from '@/components/card-media-item'
import SearchHistory from '@/components/search-history'
import type { MediaItem } from '@/dtos/media.dto'

const schema = type({ 'panel?': "'all' | 'watching' | 'history'" })

export const Route = createFileRoute('/activity/')({
  component: Page,
  validateSearch(inp) {
    return schema.assert(inp)
  },
})

function Page() {
  const { panel = 'watching' } = Route.useSearch()
  const navigate = Route.useNavigate()
  const { width } = useViewportSize()
  const tabLabelText =
    width < 400
      ? ['History', 'Continue', 'Medias']
      : (['Search History', 'Continue Watching', 'My Media'] as const)
  return (
    <main className="px-4 pt-6 pb-12 max-w-7xl mx-auto text-white">
      {/* Mantine Tabs */}
      <Tabs
        color="red"
        value={panel}
        onChange={(v) =>
          navigate({ search: { panel: (v ?? undefined) as typeof panel } })
        }
        keepMounted={false}
        classNames={{
          list: 'border-b border-zinc-800 overflow-x-auto flex-nowrap',
          tabLabel: 'text-white',
        }}
      >
        <Tabs.List className="mb-6">
          <Tabs.Tab value="history" leftSection={<Icon icon="mdi:history" />}>
            {tabLabelText[0]}
          </Tabs.Tab>

          <Tabs.Tab
            value="watching"
            leftSection={<Icon icon="mdi:play-circle" />}
          >
            {tabLabelText[1]}
          </Tabs.Tab>

          <Tabs.Tab value="all" leftSection={<Icon icon="mdi:list-box" />}>
            {tabLabelText[2]}
          </Tabs.Tab>
        </Tabs.List>

        {/* Panels */}
        <Tabs.Panel value="history">
          <Container>
            <SearchHistory />
          </Container>
        </Tabs.Panel>

        <Tabs.Panel value="watching">
          <ContinueWatching />
        </Tabs.Panel>

        <Tabs.Panel value="all">
          <AllMedias />
        </Tabs.Panel>
      </Tabs>
    </main>
  )
}

function Container({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-wrap gap-4 pb-6 justify-start">
      {children}
    </section>
  )
}

function ContinueWatching() {
  const items = useStore(mediaStore.store)
  const watchingItems = items.filter((i: MediaItem) => i.status === 'watching')

  return (
    <Container>
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
  const items = useStore(mediaStore.store)

  return (
    <Container>
      {items.map((item: MediaItem) => (
        <CardMediaItem key={item.id} {...item} />
      ))}
      {items.length === 0 && (
        <p className="text-sm text-gray-400">
          No media found in your collection.
        </p>
      )}
    </Container>
  )
}
