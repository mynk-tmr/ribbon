import badge from '@/styles/badge'
import { headings, link, text } from '@/styles/typography'
import { getRouteApi, Link } from '@tanstack/react-router'
import { useReducer } from 'react'
import { MetaItem } from '../atoms/MetaItem'
import { Poster } from '../atoms/Poster'
import { RatingBadge } from '../atoms/RatingBadge'

function SeeMore(props: { overview: string }) {
  const [open, toggle] = useReducer((prev) => !prev, false)
  const className = open || props.overview.length <= 100 ? '' : 'line-clamp-3'
  const btnText = open ? 'Read less' : 'Read more'
  return (
    <div>
      <p className={text({ as: 'small', className })}>{props.overview}</p>
      <button
        disabled={props.overview.length <= 100}
        onClick={toggle}
        className='text-steelBlue cursor-pointer text-sm font-medium disabled:opacity-45'
      >
        {btnText}
      </button>
    </div>
  )
}

function FinaleBadge() {
  return (
    <span
      className={badge({
        intent: 'destructive',
        class: 'absolute top-1 left-1',
        shape: 'pill',
        size: 'sm',
      })}
    >
      Finale
    </span>
  )
}

const routeApi = getRouteApi('/$media/$id/season/$num/$end/')

export function Episode(props: { index: number }) {
  const { season } = routeApi.useLoaderData()
  const params = routeApi.useParams()
  const episode = season.episodes[props.index]
  return (
    <article className='space-y-4 rounded-md bg-white/10'>
      <div className='group relative h-42'>
        <Poster
          className='rounded-t-md'
          withHover={false}
          path={episode.still_path}
          alt={episode.name}
          size='w500'
        />
        <Link
          className={link({
            style: 'wrapper',
            class: 'opacity-0 group-hover:opacity-100',
          })}
          to='/$media/$id/season/$num/$end/episode/$ep'
          params={{ ...params, ep: String(episode.episode_number) }}
        >
          Stream Now
        </Link>
        <RatingBadge rating={episode.vote_average} />
        {episode.episode_type === 'finale' && <FinaleBadge />}
      </div>
      <div className='space-y-2 px-4 pb-4'>
        <h3 className={headings({ level: 'h6' })}>
          {episode.episode_number}. {episode.name}
        </h3>
        <div className='text-lightGray flex justify-between text-xs font-bold'>
          <MetaItem icon='mdi:calendar' label={episode.air_date} />
          <MetaItem
            icon='mdi:timer-outline'
            label={`${episode.runtime ?? '?'} min`}
          />
        </div>
        <SeeMore overview={episode.overview} />
      </div>
    </article>
  )
}
