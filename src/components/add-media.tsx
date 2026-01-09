import { Icon } from '@iconify/react'
import { ActionIcon, Button } from '@mantine/core'
import { useStore } from '@nanostores/react'
import { useState } from 'react'
import { authStore } from '@/application/stores/auth.store'
import { mediaStore } from '@/application/stores/media.store'
import type { MediaAddInput } from '@/dtos/media.dto'

export type AddMediaProp = MediaAddInput & { variant?: 'small' }

export default function AddorRemoveMedia({ variant, ...props }: AddMediaProp) {
  const medias = useStore(mediaStore.store)
  const { user } = useStore(authStore.store)
  const [loading, setLoading] = useState(false)
  const exists = medias.some((m) => m.id === props.id)

  const addIcon = <Icon icon="mdi:bookmark-plus" className="text-white" />
  const removeIcon = <Icon icon="mdi:delete" className="text-red-500" />

  const onAdd = async () => {
    setLoading(true)
    try {
      await mediaStore.add({ season: 1, episode: 1, ...props })
    } finally {
      setLoading(false)
    }
  }

  const onRemove = async () => {
    setLoading(true)
    try {
      await mediaStore.remove(props.id)
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'small') {
    return exists ? (
      <ActionIcon
        radius="xl"
        bg="white"
        onClick={onRemove}
        disabled={loading}
        loading={loading}
      >
        {removeIcon}
      </ActionIcon>
    ) : (
      <ActionIcon
        radius="xl"
        bg="dark"
        onClick={onAdd}
        disabled={loading}
        loading={loading}
      >
        {addIcon}
      </ActionIcon>
    )
  }

  if (!user) {
    return (
      <Button size="xs" bg="gray" disabled>
        Login to Track
      </Button>
    )
  }

  return exists ? (
    <Button
      size="xs"
      bg="white"
      c="red.6"
      onClick={onRemove}
      disabled={loading}
      loading={loading}
    >
      <span className="inline-flex items-center gap-1">
        {removeIcon} Untrack
      </span>
    </Button>
  ) : (
    <Button
      size="xs"
      bg="blue.6"
      onClick={onAdd}
      disabled={loading}
      loading={loading}
    >
      <span className="inline-flex items-center gap-1">
        {addIcon} Watchlist
      </span>
    </Button>
  )
}
