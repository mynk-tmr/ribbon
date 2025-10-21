import { tv } from 'tailwind-variants'

const badge = tv({
  base: 'inline-flex items-center font-medium transition-colors',
  variants: {
    intent: {
      primary: '',
      secondary: '',
      success: '',
      warning: '',
      destructive: '',
      info: '',
      ghost: '',
    },
    style: { filled: '', outline: '' },
    shape: {
      regular: 'rounded px-2 py-0.5',
      pill: 'rounded-full px-4 py-0.5',
      square: 'rounded-xs px-2 py-0.5',
      circular: 'h-8 w-8 justify-center rounded-full p-0',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      icon: 'flex h-8 w-8 items-center justify-center p-0',
    },
    iconOnly: { true: '' },
  },
  compoundVariants: [
    // Filled styles: swapped fg/bg using theme
    { intent: 'primary', style: 'filled', class: 'bg-blueViolet text-white' },
    { intent: 'secondary', style: 'filled', class: 'bg-charcoal text-white' },
    { intent: 'success', style: 'filled', class: 'bg-forestGreen text-white' },
    { intent: 'warning', style: 'filled', class: 'bg-darkOrange text-white' },
    {
      intent: 'destructive',
      style: 'filled',
      class: 'bg-fireBrick text-white',
    },
    { intent: 'info', style: 'filled', class: 'bg-steelBlue text-white' },
    { intent: 'ghost', style: 'filled', class: 'bg-gray text-white' },
    // Outline styles
    {
      intent: 'primary',
      style: 'outline',
      class: 'border-blueViolet text-blueViolet border',
    },
    {
      intent: 'secondary',
      style: 'outline',
      class: 'border-silver text-silver border',
    },
    {
      intent: 'success',
      style: 'outline',
      class: 'border-forestGreen text-forestGreen border',
    },
    {
      intent: 'warning',
      style: 'outline',
      class: 'border-darkOrange text-darkOrange border',
    },
    {
      intent: 'destructive',
      style: 'outline',
      class: 'border-fireBrick text-fireBrick border',
    },
    {
      intent: 'info',
      style: 'outline',
      class: 'border-steelBlue text-steelBlue border',
    },
    {
      intent: 'ghost',
      style: 'outline',
      class: 'border-gray text-gray border',
    },
    // Size/shape tweaks
    {
      shape: 'circular',
      size: 'icon',
      class: 'flex h-8 w-8 items-center justify-center p-0',
    },
    { shape: 'pill', size: 'lg', class: 'px-6' },
    { shape: 'pill', size: 'md', class: 'px-4' },
    { shape: 'pill', size: 'sm', class: 'px-3' },
  ],
  defaultVariants: {
    intent: 'primary',
    style: 'filled',
    shape: 'regular',
    size: 'md',
    iconOnly: false,
  },
})

export default badge
