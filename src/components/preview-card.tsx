import { type TMDB, tmdb } from '@/config/tmdb'
import { FmtYear } from '@/helpers/formatters'
import BaseEntityCard from './base-entity-card'
import { MetaItem } from './meta-item'
import { RatingCircle } from './rating-circle'

interface Props {
  item: TMDB.Movie | TMDB.TV
}

export default function PreviewCard({ item }: Props) {
  const { vote_average, poster_path, original_language } = item
  const { title, release_date } = tmdb.isMovie(item)
    ? { title: item.title, release_date: item.release_date }
    : { title: item.name, release_date: item.first_air_date }

  const media = tmdb.isMovie(item) ? 'movie' : 'tv'
  return (
    <BaseEntityCard
      title={title}
      posterPath={poster_path}
      to="/details/$media/$id/$similar"
      params={{ id: item.id, media, similar: 1 }}
      topRight={<RatingCircle rating={vote_average} />}
      footer={
        <>
          <MetaItem icon="mdi:calendar" label={FmtYear(release_date)} />
          <MetaItem icon="mdi:translate" label={original_language} />
        </>
      }
    />
  )
}
