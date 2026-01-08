import { Icon } from '@iconify/react'
import { Badge, Button } from '@mantine/core'
import { getRouteApi, Link } from '@tanstack/react-router'
import { tmdb } from '@/application/api/tmdb/tmdb.client'
import { FmtHour, FmtPlural, FmtYear } from '@/shared/utils/formatters'
import AddorRemoveMedia from './add-media'
import Poster from './poster'
import { RatingCircle } from './rating-circle'

function useDetails() {
  const route = getRouteApi('/details/$media/$id')
  const { details } = route.useLoaderData()
  const is_movie = tmdb.isMovie(details)
  return {
    ...details,
    is_movie,
    runtime: is_movie
      ? FmtHour(details.runtime)
      : FmtPlural(details.number_of_seasons, 'season'),
    year: FmtYear(details.release_date),
    link: is_movie
      ? tmdb.streamUrl(details.id)
      : `/details/tv/${details.id}/season/1/${details.number_of_seasons}`,
  }
}

export default function Overview() {
  const details = useDetails()
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6 md:flex-row">
      {/* Poster */}
      <div className="min-w-64 md:min-w-80">
        <Poster h={480} size="w780" path={details.poster_path} />
      </div>

      {/* Main info */}
      <article className="grid gap-y-7">
        <header className="flex items-center gap-3">
          <h2 className="text-4xl font-bold">{details.title}</h2>
          <RatingCircle
            rating={details.vote_average}
            size={50}
            textSize="text-lg"
            strokeWidth={6}
          />
        </header>

        {/* User Action */}
        <div className="flex flex-wrap gap-2">
          <AddorRemoveMedia
            id={details.id}
            media_type={details.media_type}
            poster_path={details.poster_path}
            title={details.title}
          />
          {details.is_movie ? (
            <Button
              size="xs"
              component={'a'}
              href={details.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch now
            </Button>
          ) : (
            <Button
              size="xs"
              color="violet.7"
              component={Link}
              to={details.link}
            >
              View Episodes
            </Button>
          )}
          {details.homepage && (
            <Button
              size="xs"
              color="gray"
              component={'a'}
              href={details.homepage}
              target="_blank"
              rel="noopener noreferrer"
            >
              Homepage
            </Button>
          )}
        </div>

        {/* Tagline */}
        {details.tagline && (
          <div className="flex items-center gap-1">
            <Icon
              icon="tabler:quote"
              width={24}
              height={24}
              className="text-gray-400"
            />
            <em className="text-sm italic">{details.tagline}</em>
          </div>
        )}

        {/* Badges for runtime, release date, status */}
        <div className="space-x-2">
          <Badge color="green" leftSection={<Icon icon="mdi:clock" />}>
            {details.runtime}
          </Badge>
          <Badge color="grape" leftSection={<Icon icon="mdi:calendar" />}>
            {details.year}
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
            🗣️{' '}
            {details.spoken_languages.map((l) => l.english_name).join(', ') ||
              'N/A'}
          </span>
        </div>
      </article>
    </section>
  )
}
