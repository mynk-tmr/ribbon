import { tv, type VariantProps } from 'tailwind-variants'

export const formControl = tv({
  slots: {
    root: 'flex flex-col gap-1 font-sans',
    label: 'text-silver text-sm font-medium select-none',
    wrapper:
      'border-lightGray bg-darkGray text-silver focus-within:ring-cornflowerBlue focus-within:border-cornflowerBlue relative flex items-center rounded-lg border transition-colors duration-150 focus-within:ring-2',
    icon: 'text-silver pointer-events-none flex items-center justify-center pl-3',
    input:
      'text-silver placeholder:text-gray w-full bg-transparent px-3 py-2 text-sm focus:outline-none',
    select:
      'text-silver *:bg-darkGray *:text-silver w-full cursor-pointer appearance-none bg-transparent px-3 py-2 text-sm focus:outline-none',
    textarea:
      'border-lightGray bg-darkGray text-silver placeholder:text-gray focus:ring-cornflowerBlue focus:border-cornflowerBlue min-h-[100px] w-full rounded-lg border px-3 py-2 text-sm transition-colors duration-150 focus:ring-2 focus:outline-none',
    helper: 'text-gray text-xs',
    error: 'text-fireBrick text-sm',
    chevron:
      'text-silver pointer-events-none absolute right-3 flex items-center justify-center',
  },
  variants: {
    state: {
      default: {},
      error: {
        wrapper:
          'border-fireBrick focus-within:ring-fireBrick focus-within:border-fireBrick',
      },
      success: {
        wrapper:
          'border-forestGreen focus-within:ring-forestGreen focus-within:border-forestGreen',
      },
      disabled: {
        wrapper: 'bg-charcoal border-darkGray cursor-not-allowed opacity-60',
        select: 'cursor-not-allowed',
        input: 'cursor-not-allowed',
        textarea: 'cursor-not-allowed',
      },
    },
    size: {
      sm: {
        select: 'px-2 py-1 text-sm',
        input: 'px-2 py-1 text-sm',
        textarea: 'px-2 py-1 text-sm',
        wrapper: 'rounded-md',
        icon: 'pl-2 text-sm',
      },
      md: {},
      lg: {
        select: 'px-4 py-3 text-base',
        input: 'px-4 py-3 text-base',
        textarea: 'px-4 py-3 text-base',
        wrapper: 'rounded-xl',
        icon: 'pl-4 text-base',
      },
    },
    withIcon: {
      true: { select: 'pl-2', input: 'pl-2', textarea: 'pl-2' },
      false: {},
    },
  },
  compoundVariants: [
    { withIcon: true, size: 'sm', class: { icon: 'text-sm' } },
    { withIcon: true, size: 'lg', class: { icon: 'text-lg' } },
  ],
  defaultVariants: { state: 'default', size: 'md', withIcon: false },
})

export type FormControlVariants = VariantProps<typeof formControl>
