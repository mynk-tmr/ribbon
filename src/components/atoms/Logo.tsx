import { headings } from '@/styles/typography'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <figure className={`flex items-center gap-1 ${className}`}>
      <img
        decoding='async'
        src='/favicon.svg'
        alt='Ribbon'
        className='size-8 sm:size-10'
      />
      <span className={headings({ level: 'h3', intent: 'info' })}>Ribbon</span>
    </figure>
  )
}
