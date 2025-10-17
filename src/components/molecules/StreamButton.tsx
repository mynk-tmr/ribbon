import button from '@/styles/button'
import { Link } from '@tanstack/react-router'

export function StreamButton(props: { isMovie: boolean; id: number }) {
  if (props.isMovie) {
    return (
      <Link
        className={button()}
        to='/$media/$id/stream'
        params={{
          media: 'movie',
          id: props.id,
        }}
      >
        Stream Now
      </Link>
    )
  } else {
    return (
      <Link
        className={button()}
        to='/$media/$id/season/$num'
        params={{
          id: props.id,
          num: '1',
          media: 'tv',
        }}
      >
        View Episodes
      </Link>
    )
  }
}
