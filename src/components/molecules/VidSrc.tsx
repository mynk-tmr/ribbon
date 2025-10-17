import { link } from '@/styles/typography'
import { Link } from '@tanstack/react-router'

type Props =
  | {
      type: 'movie'
      id: number
    }
  | {
      type: 'tv'
      id: number
      season: number
      episode: number
    }

export function VidSrc(props: Props) {
  const BASE_URL = `https://vidsrc.net/embed/${props.type}/${props.id}${
    props.type === 'tv' ? `/${props.season}/${props.episode}` : ''
  }`
  return (
    <div className='mx-auto max-w-5xl px-4 pt-8'>
      {/* Responsive video container */}
      <div className='aspect-video w-full overflow-hidden rounded-xl shadow-lg'>
        <iframe
          className='size-[calc(100%-2rem)] rounded-lg'
          src={BASE_URL}
          title='Video Player'
          allowFullScreen
          allow='autoplay; picture-in-picture'
        />
      </div>
      <div
        ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })}
        className='flex flex-wrap justify-between gap-3 px-2'
      >
        <BackButton {...props} />
      </div>
    </div>
  )
}

function BackButton(props: { type: 'movie' | 'tv'; id: number }) {
  if (props.type === 'movie') {
    return (
      <Link
        className={link()}
        replace
        to='/$media/$id/overview/$similar'
        params={{ media: 'movie', id: props.id, similar: 1 }}
      >
        Back to Movie
      </Link>
    )
  }
  return null
}
