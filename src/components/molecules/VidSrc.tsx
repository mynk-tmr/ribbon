import { useEffect } from 'react'

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

  useEffect(() => {
    window.scrollBy(0, 1999)
  }, [props])

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
    </div>
  )
}
