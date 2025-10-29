import { Icon } from '@iconify/react'
import { ActionIcon, Select } from '@mantine/core'
import { $myMedias, type MediaItem, useIDBStore } from '@/config/idb-store'
import cn from '@/helpers/cn'

export default function PlanFavorite(
  props: Omit<MediaItem, 'addedAt' | 'updatedAt' | 'status' | 'favourite'> & {
    className?: string
  },
) {
  const myMedia = useIDBStore($myMedias, (st) => st.find((m) => m.id === props.id))

  function baseAdd(status: MediaItem['status'], favourite = false) {
    $myMedias.add({ ...props, status, favourite })
  }

  return (
    <div className={cn.filter('flex items-center gap-2', props.className)}>
      <Select
        opacity={0.75}
        size="xs"
        placeholder="Track this"
        data={[
          { label: '👀 Watching', value: 'watching' },
          { label: '✅ Completed', value: 'completed' },
          { label: '😄 Planned', value: 'planned' },
          { label: '❌ Delete', value: 'delete' },
        ]}
        value={myMedia?.status}
        maw={135}
        onChange={(status) => {
          if (status === 'delete') {
            $myMedias.drop(props.id)
            return
          }
          if (myMedia)
            $myMedias.put(myMedia.id, { status: status as MediaItem['status'] })
          else baseAdd(status as MediaItem['status'])
        }}
      />
      <ActionIcon
        bg={myMedia?.favourite ? 'red' : 'gray'}
        radius={'xl'}
        onClick={() => {
          if (myMedia) $myMedias.put(props.id, { favourite: !myMedia.favourite })
          else baseAdd('planned', true)
        }}
      >
        {myMedia?.favourite ? <Icon icon="mdi:heart" /> : <Icon icon="mdi:thumb-up" />}
      </ActionIcon>
    </div>
  )
}
