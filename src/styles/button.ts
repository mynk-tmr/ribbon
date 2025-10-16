import { tv } from 'tailwind-variants'

const button = tv({
  base: 'inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.99] cursor-pointer',
  variants: {
    intent: {
      primary:
        'bg-blueViolet text-white hover:bg-blueViolet/80 focus:ring-blueViolet',
      secondary: 'bg-lightGray text-charcoal hover:bg-silver focus:ring-silver',
      destructive:
        'bg-fireBrick text-white hover:bg-fireBrick/80 focus:ring-fireBrick',
      success: 'bg-forestGreen text-white hover:bg-teal focus:ring-forestGreen',
      warning:
        'bg-darkOrange text-white hover:bg-darkOrange/80 focus:ring-darkOrange',
      info: 'bg-steelBlue text-white hover:bg-cornflowerBlue focus:ring-steelBlue',
      outline:
        'border border-silver bg-white text-charcoal hover:bg-lightGray focus:ring-silver',
      ghost:
        'bg-transparent text-charcoal hover:bg-lightGray focus:ring-silver',
    },
    style: {
      filled: '',
      outline: 'border bg-transparent', // thinner border
    },
    shape: {
      regular: 'rounded',
      square: 'rounded-sm',
      circular: 'rounded-full p-0',
      pill: 'rounded-full px-6',
    },
    size: {
      sm: 'text-sm px-3 py-1',
      md: 'text-base px-6 py-1.5',
      lg: 'text-lg px-6 py-3',
      icon: 'w-10 h-10 text-base',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed pointer-events-none',
      false: '',
    },
    iconOnly: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      style: 'outline',
      intent: 'primary',
      class:
        'border-blueViolet text-blueViolet hover:bg-blueViolet hover:text-white hover:border-blueViolet/80',
    },
    {
      style: 'outline',
      intent: 'secondary',
      class:
        'border-silver text-silver hover:bg-silver hover:text-charcoal hover:border-silver/80',
    },
    {
      style: 'outline',
      intent: 'destructive',
      class:
        'border-fireBrick text-fireBrick hover:bg-fireBrick hover:text-white hover:border-fireBrick/80',
    },
    {
      style: 'outline',
      intent: 'success',
      class:
        'border-forestGreen text-forestGreen hover:bg-forestGreen hover:text-white hover:border-forestGreen/80',
    },
    {
      style: 'outline',
      intent: 'warning',
      class:
        'border-darkOrange text-darkOrange hover:bg-darkOrange hover:text-white hover:border-darkOrange/80',
    },
    {
      style: 'outline',
      intent: 'info',
      class:
        'border-steelBlue text-steelBlue hover:bg-steelBlue hover:text-white hover:border-steelBlue/80',
    },
    {
      style: 'outline',
      intent: 'ghost',
      class:
        'border-silver text-charcoal hover:bg-lightGray hover:text-charcoal hover:border-silver/80',
    },
    { shape: 'circular', size: 'icon', class: 'w-10 h-10 p-0' },
    { shape: 'square', size: 'icon', class: 'w-10 h-10 p-0' },
    { shape: 'pill', size: 'sm', class: 'px-6' },
    { shape: 'pill', size: 'md', class: 'px-8' },
    { shape: 'pill', size: 'lg', class: 'px-12' },
    // Regular outline: thinner border now
    { shape: 'regular', style: 'outline', class: 'border' },
  ],
  defaultVariants: {
    intent: 'primary',
    style: 'filled',
    size: 'md',
    shape: 'regular',
    disabled: false,
    iconOnly: false,
  },
})

export default button
