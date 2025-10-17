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
  base: 'font-medium transition-all duration-200',
  variants: {
    disabled: {
      true: 'pointer-events-none opacity-50',
    },
    style: {
      text: 'text-silver [&.active]:border-steelBlue border-b-2 border-transparent [&.active]:scale-110',
      wrapper:
        'absolute inset-0 grid h-full place-items-center bg-black/80 transition-all duration-200',
    },
  },
  defaultVariants: {
    disabled: false,
    style: 'text',
  },
})

export const text = tv({
  base: 'text-silver',
  variants: {
    as: {
      tagline: 'text-sm not-italic',
      body: 'leading-6 md:text-lg',
      small: 'text-sm leading-5',
      label: 'text-sm font-medium',
    },
  },
})
