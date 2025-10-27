import { Chip, Spoiler } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { useReducer } from 'react'
import EntityGrid from '@/components/entity-grid'
import { MetaItem } from '@/components/meta-item'
import Poster from '@/components/poster'
import { tmdb } from '@/config/tmdb'

export const Route = createFileRoute('/person/$id/')({
  component: RouteComponent,
  params: { parse: (raw) => ({ id: Number(raw.id) }) },
  async loader({ params }) {
    const [person, { cast }] = await Promise.all([
      tmdb.details.person(params.id),
      tmdb.person.credits(params.id),
    ])

    const itemMap = new Map(cast.map((i) => [i.id, i]))
    return { person, items: Array.from(itemMap.values()) }
  },
})

function RouteComponent() {
  return (
    <main className="page space-y-10">
      <PersonDetails />
      <WorkExperience />
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

  const getAge = () => {
    if (!birthday) return null
    const age = Date.now() - new Date(birthday).getTime()
    const years = age / 1000 / 60 / 60 / 24 / 365
    return Math.floor(years)
  }
  const AGE = getAge()

  const popularityString = Math.floor(popularity * 100)

  return (
    <section className="mt-8 px-4 mx-auto max-w-6xl flex flex-col md:flex-row gap-8">
      <div className="md:w-64 shrink-0">
        <Poster path={profile_path} size="w500" h={380} />
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

function WorkExperience() {
  const { items } = Route.useLoaderData()
  const [mode, toggle] = useReducer((s) => (s === 'movie' ? 'tv' : 'movie'), 'movie')
  const labelSuffix = mode === 'movie' ? `Movies` : `Series`
  return (
    <section className="space-y-16">
      <EntityGrid
        head={(i) => `Featured in ${i.length} ${labelSuffix}`}
        controls={
          <Chip.Group multiple={false} value={mode} onChange={toggle}>
            <Chip mr="sm" value="movie">
              Movies
            </Chip>
            <Chip value="tv">Series</Chip>
          </Chip.Group>
        }
        items={items.filter((i) => i.media_type === mode)}
      />
    </section>
  )
}
