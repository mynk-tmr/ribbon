import { Icon } from '@iconify/react'
import { ActionIcon } from '@mantine/core'
import { useStore } from '@nanostores/react'
import { useState } from 'react'
import { mediaStore } from '@/application/stores/media.store'
import type { MediaItem } from '@/dtos/media.dto'

export default function ChangeStatus({ id }: { id: MediaItem['id'] }) {
  const medias = useStore(mediaStore.store)
  const [loading, setLoading] = useState(false)
  const curr = medias.find((m) => m.id === id)

  if (!curr) return null

  const watching = curr.status === 'watching'

  const onClick = async () => {
    setLoading(true)
    try {
      await mediaStore.updateStatus(id, watching ? 'completed' : 'watching')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ActionIcon
      radius="xl"
      variant="filled"
      color={watching ? 'dark' : 'teal'}
      onClick={onClick}
      disabled={loading}
      loading={loading}
    >
      <Icon icon={'mdi:check'} />
    </ActionIcon>
  )
}
