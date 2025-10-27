import type { JSX } from 'react'
import cn from '@/helpers/cn'

export default function Logo({ className, ...props }: JSX.IntrinsicElements['img']) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/favicon.svg"
        alt="Ribbon"
        className={cn.filter('w-8 h-8 object-cover', className)}
        {...props}
      />
      <span>Ribbon</span>
    </div>
  )
}
