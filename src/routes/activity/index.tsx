import { Poster } from '@/components/atoms/Poster'
import { SearchHistory } from '@/components/organisms/SearchHistory'
import { useStore } from '@/lib/externs/sync-store'
import type { IMedia } from '@/lib/indexdb/setup'
import { $medias, $searches } from '@/lib/indexdb/stores'
import badge from '@/styles/badge'
import button from '@/styles/button'
import { headings, text } from '@/styles/typography'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState, useSyncExternalStore } from 'react'

export const Route = createFileRoute('/activity/')({
  component: RouteComponent,
  staleTime: 0,
})

function RouteComponent() {
  return (
    <main className='space-y-8'>
      <Container
        onClear={() => $searches.clear()}
        heading='Search History'
        subheading='You can clear individual searches or the entire history.'
      >
        <SearchHistory disableAll />
      </Container>
      <MovieHistory />
      <TvHistory />
    </main>
  )
}

function MovieHistory() {
  const movies = useSyncExternalStore($medias.subscribe, () => $medias.movies)
  return (
    <Container
      onClear={() => $medias.clearMovies()}
      heading='Movie History'
      subheading='You can manage your movie history.'
    >
      <MediaHistory medias={movies} />
    </Container>
  )
}

function TvHistory() {
  const tv = useSyncExternalStore($medias.subscribe, () => $medias.tvs)
  return (
    <Container
      onClear={() => $medias.clearTvs()}
      heading='TV History'
      subheading='You can manage your TV history.'
    >
      <MediaHistory medias={tv} />
    </Container>
  )
}

interface ContainerProps {
  children: React.ReactNode
  onClear: () => Promise<void>
  heading: string
  subheading: string
}

function Container({ children, onClear, heading, subheading }: ContainerProps) {
  const [visible, setVisible] = useState(true)
  const router = useRouter()
  async function handleClear() {
    const p = window.confirm('Are you sure you want to clear your history?')
    if (p) {
      onClear()
      await router.invalidate({ sync: true })
    }
  }

  return (
    <section className='mx-auto max-w-3xl border-b pb-8'>
      <div className='mt-2 flex items-center gap-2'>
        <h2 className={headings({ level: 'h4', class: 'text-center' })}>
          {heading}
        </h2>
        <button
          onClick={() => setVisible(!visible)}
          className={button({
            intent: 'secondary',
            size: 'sm',
            class: 'ml-auto',
          })}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
        <button
          onClick={handleClear}
          className={button({ intent: 'destructive', size: 'sm' })}
        >
          Clear
        </button>
      </div>
      <p className='text-silver mt-2 mb-4 text-sm'>{subheading}</p>
      {visible ? (
        children
      ) : (
        <p className='text-silver text-center text-sm'>History is hidden.</p>
      )}
    </section>
  )
}

function MediaHistory({ medias }: { medias: IMedia[] }) {
  const tvspecific = (media: IMedia) => {
    if (media.progress === 100) return '✅'
    if (media.season === undefined) return ''
    return `S${media.season}${media.episode ? `E${media.episode}` : ''}`
  }

  return (
    <ul className='flex flex-wrap gap-6'>
      {medias.map((m) => (
        <li key={m.id} className='flex gap-4 sm:grid sm:grid-cols-[160px]'>
          <div className='relative'>
            <MagiLink p={m}>
              <Poster
                className='max-h-20'
                path={m.poster_path}
                size='w342'
                alt={m.title}
              />
            </MagiLink>
          </div>
          <div>
            <h3 className={text({ as: 'small', class: 'line-clamp-2' })}>
              {m.title}
            </h3>
            {m.media === 'tv' && (
              <small className='mt-2 flex justify-between'>
                <b className='text-blueViolet'>{tvspecific(m)}</b>
                <ChangeStatus id={m.id} />
              </small>
            )}
            {m.media === 'movie' && <ChangeStatus id={m.id} />}
          </div>
        </li>
      ))}
    </ul>
  )
}

const MagiLink = ({
  p,
  children,
}: {
  p: IMedia
  children: React.ReactNode
}) => {
  if (p.media === 'movie')
    return (
      <Link to='/$media/$id/stream' params={{ media: 'movie', id: p.id }}>
        {children}
      </Link>
    )

  if (p.episode === undefined)
    return (
      <Link
        to='/$media/$id/season/$num/$end'
        params={{
          id: p.id,
          num: String(p.season),
          end: String(p.end),
          media: 'tv',
        }}
      >
        {children}
      </Link>
    )

  return (
    <Link
      to='/$media/$id/season/$num/$end/episode/$ep'
      params={{
        id: p.id,
        num: String(p.season),
        end: String(p.end),
        ep: String(p.episode),
        media: 'tv',
      }}
    >
      {children}
    </Link>
  )
}

function ChangeStatus(props: { id: number }) {
  const progress = useStore(
    $medias,
    (t) => t.find((m) => m.id === props.id)?.progress || 0,
  )
  function update() {
    const next = progress === 0 ? 50 : progress === 50 ? 100 : 0
    $medias.updateProgress({ id: props.id, progress: next })
  }

  return (
    <button
      onClick={update}
      className={badge({
        size: 'sm',
        class: 'cursor-pointer bg-white text-black',
      })}
    >
      {progress === 0 ? 'Track' : progress === 50 ? 'Mark Done' : 'Restart'}
    </button>
  )
}
