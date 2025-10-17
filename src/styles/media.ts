import { tv } from 'tailwind-variants'

export const poster = tv({
  base: 'aspect-[2/3] size-full rounded-md object-cover transition-transform duration-300 ease-in-out',
  variants: {
    withHover: {
      true: 'group-hover:scale-110',
    },
    withBorder: {
      true: 'border border-neutral-200 p-1',
    },
  },
  defaultVariants: {
    withHover: true,
    withBorder: false,
  },
})
