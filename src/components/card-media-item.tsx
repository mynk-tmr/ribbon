import { Link } from '@tanstack/react-router'
import type { MediaItem } from '@/config/idb-store'
import { tmdb } from '@/config/tmdb'
import { FmtTrunc } from '@/helpers/formatters'
import AddMedia from './add-media'
import Poster from './poster'

export default function CardMediaItem(props: MediaItem) {
  const link =
    props.media_type === 'movie'
      ? tmdb.streamUrl(props.id)
      : tmdb.streamUrl(props.id, props.season, props.episode)
  return (
    <div className="grid relative rounded-md w-full sm:w-auto">
      <div className="absolute z-10 right-0">
        <AddMedia {...props} variant="small" />
      </div>
      <Link to={link} className="relative">
        <Poster path={props.poster_path} size="w342" className="h-36 aspect-video" />
        <div className="absolute bottom-0 w-full">
          <div className="p-2 font-medium bg-zinc-950">
            {FmtTrunc(props.title, 20)}
            {'  '}
            {props.season && (
              <span className="text-xs align-middle">{`[ S${props.season} / E${props.episode} ]`}</span>
            )}
          </div>
        </div>
      </Link>
      <Link
        className="mt-2 text-sm text-center underline"
        to={'/details/$media/$id/$similar'}
        params={{ media: props.media_type, id: props.id, similar: 1 }}
      >
        See Overview
      </Link>
    </div>
  )
}
