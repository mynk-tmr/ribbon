import { Icon } from '@iconify/react'
import { Badge, Button } from '@mantine/core'
import { getRouteApi, Link } from '@tanstack/react-router'
import { type TMDB, tmdb } from '@/config/tmdb'
import { FmtHour, FmtPlural, FmtYear } from '@/helpers/formatters'
import Poster from './poster'
import { RatingCircle } from './rating-circle'

function useDetails() {
  const route = getRouteApi('/details/$media/$id/$similar')
  const { details } = route.useLoaderData()
  const is_movie = tmdb.isMovie(details)
  const release_date = is_movie ? details.release_date : details.first_air_date

  return {
    details,
    type: is_movie ? 'movie' : 'tv',
    title: is_movie ? details.title : details.name,
    runtime: is_movie
      ? FmtHour(details.runtime)
      : FmtPlural(details.number_of_seasons, 'season'),
    year: FmtYear(release_date),
  }
}

export default function Overview() {
  const { title, details, runtime, year } = useDetails()
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6 md:flex-row">
      {/* Poster */}
      <div className="min-w-64 md:min-w-80">
        <Poster h={480} key={title} size="w780" path={details.poster_path} />
      </div>

      {/* Main info */}
      <article className="grid gap-y-7">
        <header className="flex items-center gap-3">
          <h2 className="text-4xl font-bold">{title}</h2>
          <RatingCircle
            rating={details.vote_average}
            size={50}
            textSize="text-lg"
            strokeWidth={6}
          />
        </header>

        {/* User Action Buttons */}
        <div className="hidden items-center gap-2">{/* to do */}</div>

        {/* Tagline */}
        {details.tagline && (
          <div className="flex items-center gap-1">
            <Icon icon="tabler:quote" width={24} height={24} className="text-gray-400" />
            <em className="text-sm italic">{details.tagline}</em>
          </div>
        )}

        {/* Badges for runtime, release date, status */}
        <div className="space-x-2">
          <Badge color="green" leftSection={<Icon icon="mdi:clock" />}>
            {runtime}
          </Badge>
          <Badge color="blue" leftSection={<Icon icon="mdi:calendar" />}>
            {year}
          </Badge>
          <Badge color="brown" leftSection={<Icon icon="mdi:run" />}>
            {details.status ?? 'Finished'}
          </Badge>
        </div>

        {/* Overview */}
        <p>{details.overview || 'No overview available'}</p>

        {/* Genres */}
        <div className="space-x-2">
          {details.genres.map((g) => (
            <Badge key={g.id} variant="outline" color="white">
              {g.name}
            </Badge>
          ))}
        </div>

        {/* Origin and Spoken Languages */}
        <div className="text-lightGray flex flex-wrap gap-4">
          <span>🌍 {details.origin_country.join(', ') || 'N/A'}</span>
          <span>
            🗣️ {details.spoken_languages.map((l) => l.english_name).join(', ') || 'N/A'}
          </span>
        </div>

        {/* Bottom Button Links */}
        <footer className="space-x-4">
          <StreamButton />
          {details.homepage && (
            <Button
              variant="outline"
              color="blue"
              component={'a'}
              href={details.homepage}
              target="_blank"
              rel="noopener noreferrer"
            >
              Homepage
            </Button>
          )}
        </footer>
      </article>
    </section>
  )
}

function StreamButton() {
  const { type, details } = useDetails()
  if (type === 'movie')
    return (
      <Button
        component={'a'}
        href={`https://www.vidsrc.to/embed/movie/${details.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Watch now
      </Button>
    )
  const { id, number_of_seasons: end } = details as TMDB.TVDetail
  return (
    <Button component={Link} to={`/details/tv/${id}/season/1/${end}`}>
      View Episodes
    </Button>
  )
}
