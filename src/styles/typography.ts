import { tv } from 'tailwind-variants'

export const headings = tv({
  variants: {
    level: {
      h1: 'text-4xl leading-tight font-extrabold tracking-tight md:text-5xl lg:text-6xl',
      h2: 'text-3xl leading-snug font-bold tracking-tight md:text-4xl',
      h3: 'text-2xl leading-snug font-semibold tracking-tight md:text-3xl',
      h4: 'text-xl leading-snug font-semibold md:text-2xl',
      h5: 'text-lg leading-snug font-medium md:text-xl',
      h6: 'text-base leading-snug font-medium tracking-wide md:text-lg',
    },
    intent: {
      info: 'text-steelBlue',
    },
  },
  defaultVariants: {
    level: 'h1',
  },
})

export const link = tv({
  base: 'hover:text-darkGray relative px-2 py-1 font-medium transition-colors hover:bg-white',
  variants: {
    intent: {
      primary: 'text-lightGray bg-darkGray rounded',
    },
    disabled: {
      true: 'pointer-events-none opacity-50',
    },
    isActive: {
      true: 'bg-teal text-white',
    },
  },
  defaultVariants: {
    intent: 'primary',
    disabled: false,
  },
})
