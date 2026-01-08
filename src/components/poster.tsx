import { Image, type ImageProps } from '@mantine/core'
import cn from '@/shared/utils/cn'

interface Props extends ImageProps {
  size: 'w185' | 'w342' | 'w500' | 'w780' | 'original'
  path: string | null
  transition?: boolean
}

export default function Poster({
  size,
  path,
  className,
  transition,
  ...props
}: Props) {
  return (
    <Image
      loading="lazy"
      src={
        path
          ? `https://image.tmdb.org/t/p/${size}${path}`
          : 'https://placehold.co/342x513?text=Not+Added'
      }
      alt="poster"
      radius="md"
      className={cn.filter(
        'object-cover',
        transition && 'hover:scale-103 -z-10 transition-all duration-150',
        className,
      )}
      fallbackSrc="https://placehold.co/342x513?text=Failed+to+Load"
      {...props}
    />
  )
}
