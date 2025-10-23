import { Poster } from '@/components/atoms/Poster'
import { SearchHistory } from '@/components/organisms/SearchHistory'
import { useStore } from '@/lib/externs/sync-store'
import type { IMedia } from '@/lib/indexdb/setup'
import { $medias, RibbonDBActions } from '@/lib/indexdb/stores'
import button from '@/styles/button'
import { headings } from '@/styles/typography'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/activity/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className='space-y-8'>
      <Container
        repo={'search'}
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
  const movies = $medias.snapshot.filter((m) => m.media === 'movie')
  return (
    <Container
      repo={'media'}
      heading='Movie History'
      subheading='You can manage your movie history.'
    >
      <MediaHistory medias={movies} />
    </Container>
  )
}

function TvHistory() {
  const tv = $medias.snapshot.filter((m) => m.media === 'tv')
  return (
    <Container
      repo={'media'}
      heading='TV History'
      subheading='You can manage your TV history.'
    >
      <MediaHistory medias={tv} />
    </Container>
  )
}

interface ContainerProps {
  children: React.ReactNode
  repo: 'search' | 'media'
  heading: string
  subheading: string
}

function Container({ children, repo, heading, subheading }: ContainerProps) {
  const [visible, setVisible] = useState(true)
  const _ = useStore($medias, (t) => t.length)
  function handleClear() {
    const p = window.confirm('Are you sure you want to clear your history?')
    if (p) RibbonDBActions.clear(repo)
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
  const status = (media: IMedia) => {
    if (media.progress === 0) return 'Not Started'
    if (media.progress === 100) return 'Completed'
    return 'Watching'
  }
  const statusColor = (media: IMedia) => {
    if (media.progress === 0) return 'text-silver'
    if (media.progress === 100) return 'text-forestGreen'
    return 'text-darkOrange'
  }

  return (
    <ul className='flex flex-wrap gap-6'>
      {medias.map((m) => (
        <li key={m.id} className='flex items-center gap-4'>
          <MagiLink p={m}>
            <Poster path={m.poster_path} size='w342' alt={m.title} />
          </MagiLink>
          <div>
            <h3 className={headings({ level: 'h5' })}>{m.title}</h3>
            <small className={statusColor(m)}>{status(m)}</small>
          </div>
        </li>
      ))}
    </ul>
  )
}

const MagiLink = ({ p, children }: { p: IMedia; children: React.ReactNode }) =>
  p.media === 'movie' ? (
    <Link
      className='size-16 shrink-0'
      to='/$media/$id/stream'
      params={{ media: 'movie', id: p.id }}
    >
      {children}
    </Link>
  ) : (
    <Link
      className='size-16 shrink-0'
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
