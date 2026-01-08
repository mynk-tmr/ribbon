/** biome-ignore-all lint/suspicious/noArrayIndexKey: fine */

import { Await, createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { type TMDB, tmdb } from '@/application/api/tmdb/tmdb.client'
import BigDivider from '@/components/big-divider'
import OverflowGrid from '@/components/overflow-grid'

export const Route = createFileRoute('/discover/')({
  component: RouteComponent,

  async loader() {
    const config = [
      {
        type: 'movie',
        icon: 'mdi:movie',
        title: 'Movies',
        sections: [
          { label: 'Now Playing', domain: 'now_playing' },
          { label: 'Top Rated', domain: 'top_rated' },
          { label: 'Newly Released', domain: 'upcoming' },
        ],
      },
      {
        type: 'tv',
        icon: 'mdi:television-box',
        title: 'TV Shows',
        sections: [
          { label: 'Airing Today', domain: 'now_playing' },
          { label: 'Top Rated', domain: 'top_rated' },
          { label: 'Popular', domain: 'popular' },
        ],
      },
      {
        type: 'person',
        icon: 'mdi:robot-happy',
        title: 'People',
        sections: [{ label: 'Popular', domain: 'popular' }],
      },
    ] as const

    // return promises in same structure
    const result = config.map((group) => ({
      ...group,
      sections: group.sections.map((s) => ({
        ...s,
        data: tmdb.discover<TMDB.Media | TMDB.Person>(group.type, s.domain, 1),
      })),
    }))

    return { groups: result }
  },
})

function RouteComponent() {
  const { groups } = Route.useLoaderData()

  return (
    <main className="pl-4 max-w-7xl mx-auto space-y-10">
      {groups.map((group, gi) => (
        <div key={gi}>
          <BigDivider icon={group.icon} title={group.title} />

          {group.sections.map((sec) => (
            <section key={sec.label} className="mb-8">
              <OverflowGrid.Heading
                title={sec.label}
                linkProps={{
                  to: '/discover/$domain/$by/$page',
                  params: { domain: sec.domain, by: group.type, page: 1 },
                }}
              />
              <Suspense fallback={<OverflowGrid.Skeleton />}>
                <Await promise={sec.data}>
                  {(data) => <OverflowGrid items={data.results} />}
                </Await>
              </Suspense>
            </section>
          ))}
        </div>
      ))}
    </main>
  )
}
