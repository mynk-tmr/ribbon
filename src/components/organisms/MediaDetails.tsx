import { type TMDB, tmdb } from '@/lib/tmdb/api'
import badge from '@/styles/badge'
import button from '@/styles/button'
import { headings, text } from '@/styles/typography'
import { Icon } from '@iconify/react'
import { Link } from '@tanstack/react-router'
import { MetaItem } from '../atoms/MetaItem'
import { Poster } from '../atoms/Poster'
import { RatingBadge } from '../atoms/RatingBadge'

export function MediaDetails({
  details,
}: {
  details: TMDB.MovieDetail | TMDB.TVDetail
}) {
  const is_movie = tmdb.isMovie(details)
  const { title, release_date, runtime } = {
    title: is_movie ? details.title : details.name,
    release_date: is_movie ? details.release_date : details.first_air_date,
    runtime: is_movie
      ? `${details.runtime} min`
      : `${details.number_of_seasons} seasons`,
  }
  const year = new Date(release_date).getFullYear() || 'Unknown'
  return (
    <div className='mx-auto flex max-w-5xl flex-col gap-x-4 md:flex-row'>
      {/* Poster */}
      <div className='min-w-64 *:h-full md:min-w-80'>
        <Poster
          key={title}
          withBorder
          withHover={false}
          size='w500'
          path={details.poster_path}
          alt={title}
        />
      </div>

      {/* Main info */}
      <article className='mt-6 grid gap-y-7 md:mt-0'>
        <header className='flex flex-wrap-reverse items-center space-x-3'>
          <h2 className={headings({ level: 'h2' })}>{title}</h2>
          <RatingBadge
            rating={details.vote_average}
            size={50}
            textSize='text-lg'
            strokeWidth={6}
            isAbsolute={false}
          />
        </header>

        {/* User Action Buttons */}
        <div className='hidden items-center gap-2'>{/* to do */}</div>

        {/* Tagline */}
        {details.tagline && (
          <div className='flex items-center gap-1'>
            <Icon
              icon='tabler:quote'
              width={24}
              height={24}
              className='text-lightGray/60'
            />
            <em className={text({ as: 'tagline' })}>{details.tagline}</em>
          </div>
        )}

        {/* Badges for runtime, release date, status */}
        <div className='space-x-2'>
          <MetaItem
            className={badge({ intent: 'info' })}
            icon='mdi:clock'
            label={runtime}
          />

          <MetaItem
            className={badge({ intent: 'success' })}
            icon='mdi:calendar'
            label={year}
          />

          <MetaItem
            className={badge({ intent: 'destructive' })}
            icon={details.status === 'Ended' ? 'mdi:check' : 'mdi:run'}
            label={details.status === 'Ended' ? 'Finished' : 'Ongoing'}
          />
        </div>

        {/* Overview */}
        <p className={text({ as: 'body' })}>{details.overview}</p>

        {/* Genres */}
        <div className='space-x-2'>
          {details.genres.map((g) => (
            <span
              key={g.id}
              className={badge({ style: 'outline', intent: 'secondary' })}
            >
              {g.name}
            </span>
          ))}
        </div>

        {/* Origin and Spoken Languages */}
        <div className='text-lightGray flex flex-wrap gap-4'>
          <span>🌍 {details.origin_country.join(', ') || 'Unknown'}</span>
          <span>
            🗣️{' '}
            {details.spoken_languages.map((l) => l.english_name).join(', ') ||
              'Unknown'}
          </span>
        </div>

        {/* Bottom Button Links */}
        <footer className='space-x-4'>
          <Link
            className={button()}
            to={`/stream/$media/$id`}
            params={{
              media: is_movie ? 'movie' : 'tv',
              id: String(details.id),
            }}
          >
            {is_movie ? 'Stream' : 'View Episodes'}
          </Link>

          {details.homepage && (
            <a
              className={button({ style: 'outline', intent: 'info' })}
              href={details.homepage}
            >
              Homepage
            </a>
          )}
        </footer>
      </article>
    </div>
  )
}
