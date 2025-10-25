import { Image, type ImageProps } from '@mantine/core'
import cn from '@/helpers/cn'

interface Props extends ImageProps {
  size: 'w342' | 'w500' | 'w780' | 'original'
  path: string | null
}

export default function Poster({ size, path, className, ...props }: Props) {
  return (
    <Image
      key={path}
      loading="lazy"
      src={
        path
          ? `https://image.tmdb.org/t/p/${size}${path}`
          : 'https://placehold.co/342x513?text=Not+Added'
      }
      alt="poster"
      radius="md"
      className={cn.filter('object-cover', className)}
      fallbackSrc="https://placehold.co/342x513?text=Failed+to+Load"
      {...props}
    />
  )
}
