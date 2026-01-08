import { Badge, Spoiler } from '@mantine/core'
import { getRouteApi } from '@tanstack/react-router'
import { tmdb } from '@/application/api/tmdb/tmdb.client'
import { mediaStore } from '@/application/stores/media.store'
import type { MediaAddInput } from '@/dtos/media.dto'
import { MetaItem } from './meta-item'
import Poster from './poster'
import { RatingCircle } from './rating-circle'

const routeApi = getRouteApi('/details/$media/$id/season/$num/$end')
const r2Api = getRouteApi('/details/$media/$id')

export function Episode({ index }: { index: number }) {
  const { data: season } = routeApi.useLoaderData()
  const {
    details: { media_type, poster_path, title },
  } = r2Api.useLoaderData()
  const { id, num } = routeApi.useParams()
  const episode = season.episodes[index]
  return (
    <article className="group space-y-4 rounded-md bg-white/10">
      <div className="relative h-42">
        <Overview
          id={id}
          season={Number(num)}
          episode={index + 1}
          {...{ media_type, poster_path, title }}
        />
        <Poster
          className="rounded-t-md h-full"
          path={episode.still_path}
          size="w500"
        />
        <RatingCircle
          className="absolute top-0 right-0"
          rating={episode.vote_average}
        />
        {episode.episode_type === 'finale' && (
          <Badge
            variant="filled"
            size="xs"
            color="red"
            className="absolute top-2 left-2"
          >
            Finale
          </Badge>
        )}
        <MetaItem
          className="absolute bottom-0 right-0 text-xs p-1 bg-black/80 rounded-lg"
          icon="mdi:timer-outline"
          label={`${episode.runtime ?? '?'} min`}
        />
      </div>
      <div className="space-y-2 px-4 pb-4">
        <h3 className="text-lg font-bold">
          {episode.episode_number}. {episode.name}
        </h3>
        <Spoiler
          maxHeight={64}
          className="**:text-sm"
          showLabel="Read more"
          hideLabel="Show less"
          fz={14}
        >
          {episode.overview}
        </Spoiler>
      </div>
    </article>
  )
}

function Overview(prop: MediaAddInput & { season: number; episode: number }) {
  const link = tmdb.streamUrl(prop.id, prop.season, prop.episode)
  return (
    <a
      className="group-hover:opacity-100 opacity-0 absolute inset-0 grid place-items-center bg-black/50 text-lg"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        e.preventDefault()
        if (mediaStore.has(prop.id)) {
          mediaStore.updateProgress(prop.id, {
            season: prop.season,
            episode: prop.episode,
          })
        } else {
          mediaStore.add({
            id: prop.id,
            title: prop.title,
            media_type: prop.media_type,
            poster_path: prop.poster_path,
          })
        }
        window.open(link, '_blank', 'noopener,noreferrer')
      }}
    >
      Stream now
    </a>
  )
}
