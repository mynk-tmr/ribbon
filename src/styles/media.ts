import { tv } from 'tailwind-variants'

export const poster = tv({
  base: 'aspect-[2/3] size-full rounded-md object-cover transition-transform duration-300 ease-in-out',
  variants: {
    withHover: { true: 'group-hover:scale-110' },
    withBorder: { true: 'border border-neutral-200 p-1' },
    asBackground: { true: 'absolute inset-0 -z-10 opacity-10' },
  },
  defaultVariants: { withHover: true, withBorder: false },
})

export const card = tv({
  base: 'bg-darkGray/40 mx-auto flex max-w-lg flex-col items-center gap-6 rounded-2xl border border-white/10 p-8 shadow-lg',
})
