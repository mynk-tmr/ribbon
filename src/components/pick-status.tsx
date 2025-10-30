import { Select } from '@mantine/core'
import { $myMedias, type MediaItem, useIDBStore } from '@/config/idb-store'

export default function PickStatus(
  props: Omit<MediaItem, 'addedAt' | 'updatedAt' | 'status' | 'favourite'> & {
    className?: string
  },
) {
  const myMedia = useIDBStore($myMedias, (st) => st.find((m) => m.id === props.id))
  const data = [
    { label: '🙈 Watching', value: 'watching' },
    { label: '✅ Completed', value: 'completed' },
    { label: '😄 Planned', value: 'planned' },
  ]
  if (myMedia) data.push({ label: '❌ Delete', value: 'delete' })

  return (
    <Select
      classNames={{
        dropdown: 'bg-linear-to-b from-zinc-600 to-zinc-800',
        input: 'bg-white font-medium text-dark',
      }}
      size="xs"
      placeholder="Track ?"
      data={data}
      value={myMedia?.status}
      maw={135}
      onChange={(status) => {
        if (status === 'delete') {
          $myMedias.drop(props.id)
          return
        }
        if (myMedia) $myMedias.put(myMedia.id, { status: status as MediaItem['status'] })
        else
          $myMedias.add({
            ...props,
            status: status as MediaItem['status'],
            favourite: false,
          })
      }}
    />
  )
}
