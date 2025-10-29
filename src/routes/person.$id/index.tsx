import { Chip, Spoiler } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { useReducer } from 'react'
import EntityGrid from '@/components/entity-grid'
import { MetaItem } from '@/components/meta-item'
import Poster from '@/components/poster'
import { type TMDB, tmdb } from '@/config/tmdb'
import { FmtAge, FmtDate, FmtPopularity } from '@/helpers/formatters'

export const Route = createFileRoute('/person/$id/')({
  component: RouteComponent,
  params: { parse: (raw) => ({ id: Number(raw.id) }) },
  async loader({ params }) {
    const [person, { cast }] = await Promise.all([
      tmdb.details<TMDB.PersonDetails>('person', params.id),
      tmdb.person.credits(params.id),
    ])
    const itemMap = new Map(cast.map((i) => [i.id, i])) //to remove duplicates
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

  return (
    <section className="mt-8 px-4 mx-auto max-w-6xl flex flex-col sm:flex-row gap-8">
      <div className="md:w-64 shrink-0">
        <Poster path={profile_path} size="w500" h={380} />
      </div>

      <div className="flex-1">
        <h1 className="text-3xl md:text-5xl font-bold mb-2">{name}</h1>
        <p className=" text-gray-400 mb-4">
          {known_for_department} | ⭐ Popularity {FmtPopularity(popularity)}
        </p>

        <ul className="flex flex-wrap gap-4 text-sm text-lightGray mb-4">
          {birthday && <MetaItem label={FmtDate(birthday)} icon="mdi:cake-variant" />}
          {birthday && (
            <MetaItem
              className="text-green-400"
              icon="mdi:robot-happy"
              label={`Age ${FmtAge(birthday)}`}
            />
          )}
          {deathday && <MetaItem icon="mdi:cross" label={`Died ${FmtDate(deathday)}`} />}
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
