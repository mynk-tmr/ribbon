import { type PosterSize, tmdb } from '@/lib/tmdb/api'
import { poster } from '@/styles/media'
import { useState } from 'react'
import type { VariantProps } from 'tailwind-variants'

interface PosterProps extends VariantProps<typeof poster> {
  path?: string | null
  size?: PosterSize
  alt: string
  className?: string
}

export function Poster({
  path,
  size = 'w342',
  alt,
  className,
  ...props
}: PosterProps) {
  const [error, setError] = useState(false)

  // Fallback 1 → when path is missing
  const fallbackNotAdded = 'https://placehold.co/342x513?text=Not+Added'

  // Fallback 2 → when image fails to load
  const fallbackFailed = 'https://placehold.co/342x513?text=Failed+to+Load'

  const src = !path ? fallbackNotAdded : tmdb.pic(size, path)

  return (
    <img
      loading='lazy'
      src={error ? fallbackFailed : src}
      alt={alt}
      onError={() => setError(true)}
      className={poster({ ...props, className })}
    />
  )
}
