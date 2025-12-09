import { Icon } from '@iconify/react'
import { ActionIcon, Button } from '@mantine/core'
import { useStore } from '@nanostores/react'
import { MyMedias } from '@/config/idb-store'

export type AddMediaProp = Parameters<typeof MyMedias.add>[0] & {
  variant?: 'small'
}

export default function AddMedia({ variant, ...props }: AddMediaProp) {
  const medias = useStore(MyMedias.store)
  const exists = medias.some((m) => m.id === props.id)

  const addIcon = <Icon icon="mdi:bookmark-plus" className="text-white" />
  const removeIcon = <Icon icon="mdi:delete" className="text-white" />

  const onAdd = () => MyMedias.add(props)
  const onRemove = () => MyMedias.remove(props.id)

  if (variant === 'small') {
    return exists ? (
      <ActionIcon radius="xl" bg="red" onClick={onRemove}>
        {removeIcon}
      </ActionIcon>
    ) : (
      <ActionIcon radius="xl" bg="dark" onClick={onAdd}>
        {addIcon}
      </ActionIcon>
    )
  }

  return exists ? (
    <Button size="xs" bg="red" onClick={onRemove}>
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
