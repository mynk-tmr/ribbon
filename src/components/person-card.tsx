import { Pill } from '@mantine/core'
import type { TMDB } from '@/config/tmdb'
import { FmtPopularity, FmtTrunc } from '@/helpers/formatters'
import BaseEntityCard from './base-entity-card'
import { MetaItem } from './meta-item'

interface Props {
  person: TMDB.Person
}

export default function PersonCard({ person }: Props) {
  const { name, profile_path, popularity, known_for, known_for_department } = person
  //@ts-expect-error this is fine
  const notable = known_for?.[0]?.title || known_for?.[0]?.name || 'Multiple'
  const notableTitle = FmtTrunc(notable, 12)

  return (
    <BaseEntityCard
      to="/person/$id"
      params={{ id: person.id }}
      title={name}
      posterPath={profile_path}
      topRight={<Pill size="xs">{notableTitle}</Pill>}
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
