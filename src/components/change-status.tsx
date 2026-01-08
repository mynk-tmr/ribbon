import { Icon } from '@iconify/react'
import { ActionIcon } from '@mantine/core'
import { useStore } from '@nanostores/react'
import { mediaStore } from '@/application/stores/media.store'
import type { MediaItem } from '@/domain/entities'

export default function ChangeStatus({ id }: { id: MediaItem['id'] }) {
  const medias = useStore(mediaStore.store)
  const curr = medias.find((m) => m.id === id)

  if (!curr) return null

  const watching = curr.status === 'watching'

  return (
    <ActionIcon
      radius="xl"
      variant="filled"
      color={watching ? 'dark' : 'teal'}
      onClick={() =>
        mediaStore.updateStatus(id, watching ? 'completed' : 'watching')
      }
    >
      <Icon icon={'mdi:check'} />
    </ActionIcon>
  )
}
