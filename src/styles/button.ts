import { tv } from 'tailwind-variants'

const button = tv({
  base: 'inline-flex cursor-pointer items-center justify-center font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-[0.99]',
  variants: {
    intent: {
      primary:
        'bg-blueViolet hover:bg-blueViolet/80 focus:ring-blueViolet text-white',
      secondary: 'bg-lightGray text-charcoal hover:bg-silver focus:ring-silver',
      destructive:
        'bg-fireBrick hover:bg-fireBrick/80 focus:ring-fireBrick text-white',
      success: 'bg-forestGreen hover:bg-teal focus:ring-forestGreen text-white',
      warning:
        'bg-darkOrange hover:bg-darkOrange/80 focus:ring-darkOrange text-white',
      info: 'bg-steelBlue hover:bg-cornflowerBlue focus:ring-steelBlue text-white',
      outline:
        'border-silver text-charcoal hover:bg-lightGray focus:ring-silver border bg-white',
      ghost:
        'text-charcoal hover:bg-lightGray focus:ring-silver bg-transparent',
    },
    style: {
      filled: '',
      outline: 'border bg-transparent', // thinner border
    },
    shape: {
      regular: 'rounded',
      square: 'rounded-sm',
      circular: 'rounded-full p-0',
      pill: 'rounded-full',
    },
    size: {
      sm: 'px-3 py-1 text-sm',
      md: 'px-6 py-1.5 text-base',
      lg: 'px-6 py-3 text-lg',
      icon: 'h-10 w-10 text-base',
    },
    disabled: {
      true: 'pointer-events-none cursor-not-allowed opacity-50',
      false: '',
    },
  },
  compoundVariants: [
    {
      style: 'outline',
      intent: 'primary',
      class: 'border-blueViolet text-blueViolet hover:bg-blueViolet/20',
    },
    {
      style: 'outline',
      intent: 'secondary',
      class: 'border-silver text-silver hover:bg-silver/20',
    },
    {
      style: 'outline',
      intent: 'destructive',
      class: 'border-fireBrick text-fireBrick hover:bg-fireBrick/20',
    },
    {
      style: 'outline',
      intent: 'success',
      class: 'border-forestGreen text-forestGreen hover:bg-forestGreen/20',
    },
    {
      style: 'outline',
      intent: 'warning',
      class: 'border-darkOrange text-darkOrange hover:bg-darkOrange/20',
    },
    {
      style: 'outline',
      intent: 'info',
      class: 'border-steelBlue text-steelBlue hover:bg-steelBlue/20',
    },
    {
      style: 'outline',
      intent: 'ghost',
      class: 'border-silver text-charcoal hover:bg-lightGray/20',
    },
    { shape: 'circular', size: 'icon', class: 'h-10 w-10 p-0' },
    { shape: 'square', size: 'icon', class: 'h-10 w-10 p-0' },
    { shape: 'pill', size: 'sm', class: 'px-4' },
    { shape: 'pill', size: 'md', class: 'px-6' },
    { shape: 'pill', size: 'lg', class: 'px-8' },
    // Regular outline: thinner border now
    { shape: 'regular', style: 'outline', class: 'border' },
  ],
  defaultVariants: {
    intent: 'primary',
    style: 'filled',
    size: 'md',
    shape: 'regular',
    disabled: false,
  },
})

export default button
