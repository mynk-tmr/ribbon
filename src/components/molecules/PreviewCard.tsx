import { tmdb, type TMDB } from '@/lib/tmdb/api'
import { MetaItem } from '../atoms/MetaItem'
import { Poster } from '../atoms/Poster'
import { RatingBadge } from '../atoms/RatingBadge'

interface Props {
  item: TMDB.Movie | TMDB.TV
}

export function PreviewCard({ item }: Props) {
  const { vote_average, poster_path, original_language } = item

  const { title, release_date } = {
    title: tmdb.isMovie(item) ? item.title : item.name,
    release_date: tmdb.isMovie(item) ? item.release_date : item.first_air_date,
  }

  const year = release_date ? new Date(release_date).getFullYear() : 'Unknown'
  return (
    <article className='group relative w-36 overflow-hidden rounded-md bg-white/10 p-1 shadow-sm md:w-44'>
      <Poster path={poster_path} alt={title} />
      <RatingBadge rating={vote_average} />
      <p className='mt-2 truncate px-1 text-sm font-semibold'>{title}</p>
      <footer className='text-lightGray mt-1 flex items-center justify-between text-sm'>
        <MetaItem icon='mdi:calendar' label={year} />
        <MetaItem icon='mdi:translate' label={original_language} />
      </footer>
    </article>
  )
}
