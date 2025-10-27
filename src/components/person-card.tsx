import { Badge } from '@mantine/core'
import type { TMDB } from '@/config/tmdb'
import BaseEntityCard from './base-entity-card'
import { MetaItem } from './meta-item'

interface Props {
  person: TMDB.Person
}

export default function PersonCard({ person }: Props) {
  const { name, profile_path, known_for_department, popularity, known_for } = person
  const notable = known_for?.[0].title || known_for?.[0].name || 'Multiple'
  const notableTitle = notable.slice(0, 12) + (notable.slice(12).length > 0 ? '...' : '')

  return (
    <BaseEntityCard
      to="/person/$id"
      params={{ id: person.id }}
      title={name}
      posterPath={profile_path}
      topRight={
        <Badge color="dark" variant="filled" size="xs" radius="xl">
          {known_for_department}
        </Badge>
      }
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
