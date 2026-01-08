import { Icon } from '@iconify/react'
import { ActionIcon } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { tmdb } from '@/application/api/tmdb/tmdb.client'
import type { MediaItem } from '@/dtos/media.dto'
import { FmtTrunc } from '@/shared/utils/formatters'
import AddorRemoveMedia from './add-media'
import ChangeStatus from './change-status'
import Poster from './poster'

export default function CardMediaItem(props: MediaItem) {
  const { id, media_type, season, episode, poster_path, title } = props

  const link =
    media_type === 'movie'
      ? tmdb.streamUrl(id)
      : tmdb.streamUrl(id, season ?? undefined, episode ?? undefined)

  return (
    <div className="relative group w-[calc(50%-1rem)] xs:w-42 select-none">
      {/* Card */}
      <div
        className="
          relative rounded-2xl overflow-hidden
          shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)]
          transition-all duration-300
          group-hover:scale-[1.04]
          group-hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.9)]
        "
      >
        {/* Poster */}
        <Link to={link}>
          <div className="relative">
            <Poster
              path={poster_path}
              size="w342"
              className="
                h-42 w-full object-cover
                rounded-2xl
              "
            />

            {/* Soft Apple TV+ poster glow */}
            <div
              className="
                absolute inset-0
                pointer-events-none
                bg-linear-to-b from-transparent via-transparent to-black/70
              "
            />

            {/* Apple TV+ title & episode info */}
            <div
              className="
                absolute bottom-0 w-full p-4
                flex flex-col
                text-white
                select-none
              "
            >
              <div className="font-semibold text-lg tracking-wide drop-shadow-lg">
                {FmtTrunc(title, 26)}
              </div>

              {media_type === 'tv' && (
                <span className="text-xs text-white/80 mt-0.5 bg-dark/80 px-2 w-fit">
                  Season {season} · Episode {episode}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Glassy floating action pill — Apple TV+ exact style */}
        <div
          className="
            flex justify-between px-3 py-1.5
            rounded-b-2xl
            bg-white/10
            backdrop-blur-md
            border border-white/20
            shadow-[0_4px_12px_rgba(0,0,0,0.4)]
          "
        >
          <AddorRemoveMedia
            id={props.id}
            media_type={props.media_type}
            poster_path={props.poster_path}
            title={props.title}
            variant="small"
          />
          <ActionIcon
            bg="blue"
            radius={'xl'}
            renderRoot={(props) => (
              <Link
                {...props}
                to="/details/$media/$id/$similar"
                params={{ media: media_type, id, similar: 1 }}
              />
            )}
          >
            <Icon icon={'lucide:external-link'} />
          </ActionIcon>
          <ChangeStatus id={id} />
        </div>
      </div>
    </div>
  )
}
