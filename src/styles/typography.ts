import { tv } from 'tailwind-variants'

const typography = tv({
  base: 'font-sans transition-colors duration-200',
  variants: {
    variant: {
      // Headings
      h1: 'text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight',
      h2: 'text-3xl md:text-4xl font-bold tracking-tight leading-snug',
      h3: 'text-2xl md:text-3xl font-semibold tracking-tight leading-snug',
      h4: 'text-xl md:text-2xl font-semibold leading-snug',
      h5: 'text-lg md:text-xl font-medium leading-snug',
      h6: 'text-base md:text-lg font-medium leading-snug uppercase tracking-wide',

      // Body / text
      body: 'text-base md:text-lg leading-relaxed font-normal text-silver',
      bodySmall: 'text-sm md:text-base leading-relaxed font-normal text-silver',

      // Supporting text
      label:
        'text-sm md:text-base font-semibold uppercase tracking-wide text-lightGray',
      caption: 'text-xs md:text-sm leading-snug text-lightGray/70',
      code: 'font-mono text-sm md:text-base bg-charcoal px-1 py-0.5 rounded',

      // Quotes
      quote:
        'italic text-cornflowerBlue border-l-4 border-blueViolet/60 pl-4 ml-2',
      blockquote:
        'relative p-4 pl-6 bg-charcoal/50 border-l-4 border-blueViolet/70 rounded-md  italic',

      // Rich text: inline / interactive
      link: 'text-cornflowerBlue! hover:text-cornflowerBlue/80 underline-offset-2 hover:underline transition-colors',
      highlight: 'bg-cornflowerBlue/20 text-lightGray px-1 py-0.5 rounded',
      list: 'list-disc list-inside text-base md:text-lg leading-relaxed space-y-1',
      listOrdered:
        'list-decimal list-inside text-base md:text-lg leading-relaxed space-y-1',
    },

    intent: {
      primary: 'text-blueViolet',
      secondary: 'text-white',
      success: 'text-forestGreen',
      warning: 'text-darkOrange ',
      destructive: 'text-fireBrick',
      info: 'text-steelBlue',
      muted: 'text-silver',
      ghost: 'text-charcoal',
    },

    uppercase: {
      true: 'uppercase tracking-wide',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'body',
    intent: 'secondary',
    uppercase: false,
  },
})

export default typography
