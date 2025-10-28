import { Badge, Spoiler } from '@mantine/core'
import { getRouteApi } from '@tanstack/react-router'
import { MetaItem } from './meta-item'
import Poster from './poster'
import { RatingCircle } from './rating-circle'

const routeApi = getRouteApi('/details/$media/$id/season/$num/$end')

export function Episode({ index }: { index: number }) {
  const { data: season } = routeApi.useLoaderData()
  const { id, num } = routeApi.useParams()
  const episode = season.episodes[index]
  const vidLink = `https://www.vidsrc.to/embed/tv/${id}/${num}/${index + 1}`

  return (
    <article className="group space-y-4 rounded-md bg-white/10">
      <div className="relative h-42">
        <a
          className="group-hover:opacity-100 opacity-0 absolute inset-0 grid place-items-center bg-black/50 text-lg"
          href={vidLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Stream now
        </a>
        <Poster className="rounded-t-md h-full" path={episode.still_path} size="w500" />
        <RatingCircle className="absolute top-0 right-0" rating={episode.vote_average} />
        {episode.episode_type === 'finale' && (
          <Badge variant="filled" size="xs" color="red" className="absolute top-2 left-2">
            Finale
          </Badge>
        )}
      </div>
      <div className="space-y-2 px-4 pb-4">
        <h3 className="text-lg font-bold">
          {episode.episode_number}. {episode.name}
        </h3>
        <div className="text-lightGray flex justify-between text-xs font-bold">
          <MetaItem icon="mdi:calendar" label={episode.air_date} />
          <MetaItem icon="mdi:timer-outline" label={`${episode.runtime ?? '?'} min`} />
        </div>
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
