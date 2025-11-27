import { Icon } from '@iconify/react'
import { ActionIcon } from '@mantine/core'
import { useStore } from '@nanostores/react'
import { type MediaItem, MyMedias } from '@/config/idb-store'

export default function ChangeStatus(props: { id: MediaItem['id'] }) {
  const medias = useStore(MyMedias.store)
  const curr = medias.find((m) => m.id === props.id)
  if (!curr) throw new Error('Media not found')
  if (curr.status === 'watching') {
    return (
      <ActionIcon
        radius={'xl'}
        color="green"
        onClick={() => MyMedias.changeStatus(props.id, 'completed')}
      >
        <Icon icon="mdi:check" className="inline" />
      </ActionIcon>
    )
  }
  return (
    <ActionIcon
      radius={'xl'}
      color="gray"
      onClick={() => MyMedias.changeStatus(props.id, 'watching')}
    >
      <Icon icon="mdi:eye" className="inline" />
    </ActionIcon>
  )
}
