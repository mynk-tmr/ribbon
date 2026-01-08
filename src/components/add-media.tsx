import { Icon } from '@iconify/react'
import { ActionIcon, Button } from '@mantine/core'
import { useStore } from '@nanostores/react'
import { mediaStore } from '@/application/stores/media.store'
import type { MediaItemInput } from '@/domain/entities'

export type AddMediaProp = MediaItemInput & { variant?: 'small' }

export default function AddorRemoveMedia({ variant, ...props }: AddMediaProp) {
  const medias = useStore(mediaStore.store)
  const exists = medias.some((m) => m.id === props.id)

  const addIcon = <Icon icon="mdi:bookmark-plus" className="text-white" />
  const removeIcon = <Icon icon="mdi:delete" className="text-red-500" />

  const onAdd = () => mediaStore.add(props)
  const onRemove = () => mediaStore.remove(props.id)

  if (variant === 'small') {
    return exists ? (
      <ActionIcon radius="xl" bg="white" onClick={onRemove}>
        {removeIcon}
      </ActionIcon>
    ) : (
      <ActionIcon radius="xl" bg="dark" onClick={onAdd}>
        {addIcon}
      </ActionIcon>
    )
  }

  return exists ? (
    <Button size="xs" bg="white" c="red.6" onClick={onRemove}>
      <span className="inline-flex items-center gap-1">
        {removeIcon} Untrack
      </span>
    </Button>
  ) : (
    <Button size="xs" bg="blue.6" onClick={onAdd}>
      <span className="inline-flex items-center gap-1">
        {addIcon} Watchlist
      </span>
    </Button>
  )
}
