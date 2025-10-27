import { Badge } from '@mantine/core'
import type { TMDB } from '@/config/tmdb'
import { MetaItem } from './meta-item'
import Poster from './poster'

interface Props {
  person: TMDB.Person
}

export default function PersonCard({ person }: Props) {
  const { name, profile_path, known_for_department, popularity, known_for } = person
  const notable = known_for[0]

  return (
    <article className="group relative w-36 overflow-hidden rounded-md bg-white/10 p-1 shadow-sm md:w-44">
      <Poster path={profile_path} size="w342" h={242} />
      <Badge
        color="dark"
        variant="filled"
        size="xs"
        radius={'xl'}
        className="absolute top-1 right-1"
      >
        {known_for_department}
      </Badge>
      <p className="mt-2 truncate px-1 text-sm font-semibold">{name}</p>
      <footer className="text-gray-400 mt-1 flex items-center justify-between text-sm">
        <MetaItem
          icon="mdi:movie-open"
          label={(notable.title || notable.name || '').slice(0, 15)}
        />
        <MetaItem
          className="text-yellow-200"
          icon="mdi:star"
          label={`${Math.round(popularity)}K`}
        />
      </footer>
    </article>
  )
}
