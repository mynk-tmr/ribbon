import { Pill } from '@mantine/core'
import { type TMDB, tmdb } from '@/config/tmdb'
import { FmtPopularity, FmtTrunc, FmtYear } from '@/helpers/formatters'
import BaseEntityCard from './base-entity-card'
import { MetaItem } from './meta-item'
import { RatingCircle } from './rating-circle'

interface Props {
  item: TMDB.Media | TMDB.Person
}

export default function PreviewCard({ item }: Props) {
  return item.media_type === 'person' ? <PersonCard {...item} /> : <MediaCard {...item} />
}

function MediaCard(props: TMDB.Media) {
  const {
    vote_average,
    poster_path,
    original_language,
    title,
    release_date,
    media_type,
    id,
  } = props
  return (
    <BaseEntityCard
      title={title}
      posterPath={poster_path}
      to="/details/$media/$id/$similar"
      params={{ id, media: media_type, similar: 1 }}
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

function PersonCard(props: TMDB.Person) {
  const { name, profile_path, popularity, known_for, known_for_department, id } = props
  const notable = known_for[0] === undefined ? 'N/A' : tmdb.normalise(known_for[0]).title
  const notableTitle = FmtTrunc(notable, 12)

  return (
    <BaseEntityCard
      to="/person/$id"
      params={{ id }}
      title={name}
      posterPath={profile_path}
      topRight={
        <Pill bg="dark.4" size="xs">
          {notableTitle}
        </Pill>
      }
      footer={
        <>
          <MetaItem icon="mdi:movie-open" label={known_for_department} />
          <MetaItem
            className="text-yellow-200"
            icon="mdi:star"
            label={FmtPopularity(popularity, true)}
          />
        </>
      }
    />
  )
}
