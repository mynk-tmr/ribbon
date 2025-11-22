import { Icon } from '@iconify/react'
import { ActionIcon, Button } from '@mantine/core'
import { useStore } from '@nanostores/react'
import { MyMedias } from '@/config/idb-store'

export type AddMediaProp = Parameters<typeof MyMedias.add>[0] & { variant?: 'small' }

export default function AddMedia({ variant, ...props }: AddMediaProp) {
  const medias = useStore(MyMedias.store)
  const curr = medias.find((m) => m.id === props.id)
  const addIcon = <Icon icon="mdi:bookmark-plus" className="inline text-2xl" />
  const removeIcon = <Icon icon="typcn:delete" className="inline text-2xl" />

  if (variant === 'small') {
    return curr ? (
      <ActionIcon color="red" onClick={() => MyMedias.remove(props.id)}>
        {removeIcon}
      </ActionIcon>
    ) : (
      <ActionIcon color="blue" onClick={() => MyMedias.add(props)}>
        {addIcon}
      </ActionIcon>
    )
  }

  return curr ? (
    <Button
      size="xs"
      leftSection={removeIcon}
      color="red"
      onClick={() => MyMedias.remove(props.id)}
    >
      Untrack
    </Button>
  ) : (
    <Button
      size="xs"
      leftSection={addIcon}
      color="blue"
      onClick={() => MyMedias.add(props)}
    >
      Watchlist
    </Button>
  )
}
