import { Icon } from '@iconify/react'
import { ActionIcon } from '@mantine/core'
import { useStore } from '@nanostores/react'
import { type MediaItem, MyMedias } from '@/config/idb-store'

export default function ChangeStatus({ id }: { id: MediaItem['id'] }) {
  const medias = useStore(MyMedias.store)
  const curr = medias.find((m) => m.id === id)

  if (!curr) return null

  const watching = curr.status === 'watching'

  return (
    <ActionIcon
      radius="xl"
      variant="filled"
      color={watching ? 'dark' : 'teal'}
      onClick={() =>
        MyMedias.changeStatus(id, watching ? 'completed' : 'watching')
      }
    >
      <Icon icon={'mdi:check'} />
    </ActionIcon>
  )
}
