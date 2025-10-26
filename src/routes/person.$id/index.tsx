import { Spoiler } from '@mantine/core'
import { createFileRoute, Link } from '@tanstack/react-router'
import { MetaItem } from '@/components/meta-item'
import Poster from '@/components/poster'
import { PreviewCard } from '@/components/preview-card'
import { type TMDB, tmdb } from '@/config/tmdb'

export const Route = createFileRoute('/person/$id/')({
  component: RouteComponent,
  params: { parse: (raw) => ({ id: Number(raw.id) }) },
  async loader({ params }) {
    const [person, credits] = (await tmdb.parallel(
      { type: 'details', payload: { id: params.id, media: 'person' } },
      { type: 'combined_credits', payload: { id: params.id } },
    )) as [TMDB.PersonDetails, TMDB.CombinedCredits]
    return { person, credits }
  },
})

function RouteComponent() {
  return (
    <main className="page space-y-10">
      <PersonDetails />
      <CombinedCredits />
    </main>
  )
}

function PersonDetails() {
  const {
    name,
    biography,
    profile_path,
    known_for_department,
    birthday,
    deathday,
    place_of_birth,
    popularity,
  } = Route.useLoaderData().person

  const [BIRTH, DEATH] = [birthday, deathday].map((birthday) =>
    new Date(birthday || '').toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
  )

  const AGE = birthday
    ? new Date().getFullYear() - new Date(birthday).getFullYear()
    : 'Unknown'

  const popularityString = Math.floor(popularity * 100)

  return (
    <section className="mt-8 px-4 mx-auto max-w-6xl flex flex-col md:flex-row gap-8">
      <div className="md:w-64 shrink-0">
        <Poster path={profile_path} size="w342" h={380} />
      </div>

      <div className="flex-1">
        <h1 className="text-3xl md:text-5xl font-bold mb-2">{name}</h1>
        <p className=" text-gray-400 mb-4">
          {known_for_department} | ⭐ Popularity {popularityString}
        </p>

        <ul className="flex flex-wrap gap-4 text-sm text-lightGray mb-4">
          {birthday && <MetaItem icon="mdi:cake-variant" label={BIRTH} />}
          {AGE && (
            <MetaItem
              className="text-green-400"
              icon="mdi:robot-happy"
              label={`Age ${AGE}`}
            />
          )}
          {deathday && <MetaItem icon="mdi:cross" label={`Died ${DEATH}`} />}
          {place_of_birth && <MetaItem icon="mdi:map-marker" label={place_of_birth} />}
        </ul>
        <Spoiler hideLabel="Show less" showLabel="Show more">
          {biography || 'No biography available.'}
        </Spoiler>
      </div>
    </section>
  )
}

function CombinedCredits() {
  const { credits } = Route.useLoaderData()
  const items = credits.cast
  items.sort((a, b) => b.vote_average - a.vote_average)
  return (
    <section className="space-y-12">
      <header>
        <h2 className="text-2xl text-center font-bold">
          Featured in {items.length} piece of work
        </h2>
        <p className="text-sm mt-2 text-gray-400 text-center">
          This list is sorted by average vote.
        </p>
      </header>
      <div className="flex flex-wrap gap-4 justify-center *:shrink-0">
        {items.map((item) => {
          return (
            <Link
              key={item.id}
              to="/$media/$id/$similar"
              params={{ id: item.id, media: item.media_type, similar: 1 }}
            >
              <PreviewCard item={item} />
            </Link>
          )
        })}
      </div>
    </section>
  )
}
