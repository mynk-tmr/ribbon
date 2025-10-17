import button from '@/styles/button'
import { Link } from '@tanstack/react-router'

type Props = {
  isMovie: boolean
  id: number
  lastSeason: number
}

export function StreamButton(props: Props) {
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
        to='/$media/$id/season/$num/$end'
        params={{
          id: props.id,
          num: '1',
          end: String(props.lastSeason),
          media: 'tv',
        }}
      >
        View Episodes
      </Link>
    )
  }
}
