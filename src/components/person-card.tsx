import type { TMDB } from '@/config/tmdb'
import { MetaItem } from './meta-item'
import Poster from './poster'
import { RatingCircle } from './rating-circle'

interface Props {
  person: TMDB.Person
}

export default function PersonCard({ person }: Props) {
  const { name, profile_path, known_for_department, popularity, gender } = person

  const genderIcon =
    gender === 1
      ? 'mdi:gender-female'
      : gender === 2
        ? 'mdi:gender-male'
        : 'mdi:gender-non-binary'

  return (
    <article className="group relative w-36 overflow-hidden rounded-md bg-white/10 p-1 shadow-sm md:w-44">
      <Poster path={profile_path} size="w342" h={242} />
      <RatingCircle rating={Math.min(popularity, 10)} /> {/* normalize popularity */}
      <p className="mt-2 truncate px-1 text-sm font-semibold">{name}</p>
      <footer className="text-gray-400 mt-1 flex items-center justify-between text-sm">
        <MetaItem icon="mdi:movie-open" label={known_for_department} />
        <MetaItem icon={genderIcon} label="" />
      </footer>
    </article>
  )
}
