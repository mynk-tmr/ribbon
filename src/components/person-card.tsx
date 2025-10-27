import { Pill } from '@mantine/core'
import type { TMDB } from '@/config/tmdb'
import BaseEntityCard from './base-entity-card'
import { MetaItem } from './meta-item'

interface Props {
  person: TMDB.Person
}

export default function PersonCard({ person }: Props) {
  const { name, profile_path, popularity, known_for, known_for_department } = person
  //@ts-expect-error this is fine
  const notable = known_for?.[0]?.title || known_for?.[0]?.name || 'Multiple'
  const notableTitle = notable.slice(0, 12) + (notable.slice(12).length > 0 ? '...' : '')

  return (
    <BaseEntityCard
      to="/person/$id"
      params={{ id: person.id }}
      title={name}
      posterPath={profile_path}
      topRight={<Pill size="xs">{known_for_department}</Pill>}
      footer={
        <>
          <MetaItem icon="mdi:movie-open" label={notableTitle} />
          <MetaItem
            className="text-yellow-200"
            icon="mdi:star"
            label={`${Math.round(popularity)}K`}
          />
        </>
      }
    />
  )
}
