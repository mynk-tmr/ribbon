import button from '@/styles/button'
import { Icon } from '@iconify/react'
import { useRef } from 'react'

type Props<T> = {
  items: T[]
  children: (item: T) => React.ReactNode
  scrollAmount?: number
}

export function HorizontalScroller<T>({
  items,
  children,
  scrollAmount,
}: Props<T>) {
  const containerRef = useRef<HTMLDivElement>(null)

  const scroller = (dir: 'left' | 'right') => () => {
    const el = containerRef.current
    if (!el) return
    const amount = scrollAmount ?? el.clientWidth * 0.8
    const left = dir === 'left' ? -amount : amount
    el.scrollBy({ left, behavior: 'smooth' })
  }

  const buttonProps = {
    type: 'button',
    className: button({
      intent: 'info',
      shape: 'circular',
      size: 'icon',
      className: 'absolute top-1/2 -translate-y-1/2 -mx-3 z-30',
    }),
  } satisfies React.ComponentProps<'button'>

  return (
    <div className='relative'>
      {/* Left button */}
      <button
        {...buttonProps}
        aria-label='Scroll left'
        onClick={scroller('left')}
      >
        <Icon icon='mdi:chevron-left' width={24} height={24} />
      </button>

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className='scrollbar-hide flex snap-x snap-mandatory gap-2 overflow-x-auto p-1 *:shrink-0 *:snap-start'
      >
        {items.map(children)}
      </div>

      {/* Right button */}
      <button
        style={{ right: 0 }}
        {...buttonProps}
        aria-label='Scroll right'
        onClick={scroller('right')}
      >
        <Icon icon='mdi:chevron-right' width={24} height={24} />
      </button>
    </div>
  )
}
