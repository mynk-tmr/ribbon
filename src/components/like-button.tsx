import { Icon } from '@iconify/react'
import { ActionIcon } from '@mantine/core'
import { $myMedias, type MediaItem, useIDBStore } from '@/config/idb-store'

export default function LikeButton(
  props: Omit<MediaItem, 'addedAt' | 'updatedAt' | 'status' | 'favourite'> & {
    className?: string
  },
) {
  const myMedia = useIDBStore($myMedias, (st) => st.find((m) => m.id === props.id))
  function toggle() {
    if (myMedia) $myMedias.put(props.id, { favourite: !myMedia.favourite })
    else $myMedias.add({ ...props, favourite: true, status: 'planned' })
  }
  return (
    <ActionIcon
      className={props.className}
      color="red"
      variant={myMedia?.favourite ? 'filled' : 'default'}
      radius={'xl'}
      onClick={toggle}
    >
      {myMedia?.favourite ? <Icon icon="mdi:heart" /> : <Icon icon="mdi:thumb-up" />}
    </ActionIcon>
  )
}
