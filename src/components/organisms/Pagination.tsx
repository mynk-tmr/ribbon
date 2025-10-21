import { Icon } from '@iconify/react'
import { tv, type VariantProps } from 'tailwind-variants'

const pagination = tv({
  slots: {
    base: 'relative flex max-w-fit flex-wrap gap-1 select-none',
    item: 'cursor-pointer rounded-md transition-colors duration-150 data-[active="true"]:bg-blue-500 data-[active="true"]:text-white',
    prev: 'cursor-pointer rounded-md disabled:pointer-events-none disabled:opacity-40',
    next: 'cursor-pointer rounded-md disabled:pointer-events-none disabled:opacity-40',
  },
  variants: { size: { xs: {}, sm: {}, md: {} }, circular: { true: {} } },
  defaultVariants: { size: 'md', active: false },
  compoundSlots: [
    {
      slots: ['item', 'prev', 'next'],
      class: [
        'flex',
        'items-center',
        'justify-center',
        'truncate',
        'box-border',
        'outline-none',
        'bg-darkGray',
        'hover:bg-darkGray/80',
        'border',
        'border-white/10',
      ],
    },
    { slots: ['item', 'prev', 'next'], size: 'xs', class: 'h-7 w-7 text-xs' },
    { slots: ['item', 'prev', 'next'], size: 'sm', class: 'h-8 w-8 text-sm' },
    { slots: ['item', 'prev', 'next'], size: 'md', class: 'h-9 w-9 text-base' },
    { slots: ['item', 'prev', 'next'], circular: true, class: 'rounded-full' },
  ],
})

interface Props extends VariantProps<typeof pagination> {
  totalPages: number
  currentPage: number
  onChange: (page: number) => void
  siblingCount?: number
  showFirstAndLast?: boolean
}

export function Pagination({
  totalPages,
  currentPage,
  onChange,
  size,
  siblingCount = 5,
  showFirstAndLast = true,
  circular,
}: Props) {
  const { base, item, prev, next } = pagination({ size, circular })

  // Utility to safely change page
  const goTo = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onChange(page)
    }
  }

  // Generate visible page numbers
  const pages: (number | 'ellipsis')[] = []
  const start = Math.max(1, currentPage - siblingCount)
  const end = Math.min(totalPages, currentPage + siblingCount)

  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('ellipsis')
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push('ellipsis')
    pages.push(totalPages)
  }

  return (
    <ul aria-label='Pagination navigation' className={base()}>
      {/* Previous */}
      {showFirstAndLast && (
        <li>
          <button
            className={prev()}
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label='Previous page'
          >
            <Icon icon='material-symbols:chevron-left-rounded' fontSize={16} />
          </button>
        </li>
      )}

      {/* Pages */}
      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <li
            key={`ellipsis-${i}`}
            className='flex w-7 items-center justify-center text-neutral-400'
          >
            …
          </li>
        ) : (
          <li key={p}>
            <button
              className={item({
                className:
                  p === currentPage &&
                  'bg-blueViolet hover:bg-blueViolet/80 border-none',
              })}
              data-active={p === currentPage}
              onClick={() => goTo(p)}
            >
              {p}
            </button>
          </li>
        ),
      )}

      {/* Next */}
      {showFirstAndLast && (
        <li>
          <button
            className={next()}
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label='Next page'
          >
            <Icon icon='material-symbols:chevron-right-rounded' fontSize={16} />
          </button>
        </li>
      )}
    </ul>
  )
}
