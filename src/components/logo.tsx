import type { JSX } from 'react'

interface Props {
  imgProps?: JSX.IntrinsicElements['img']
  labelProps?: JSX.IntrinsicElements['span']
}

export default function Logo({ imgProps, labelProps }: Props) {
  return (
    <div className="flex items-center gap-3">
      <img src="/favicon.svg" alt="Ribbon" {...imgProps} />
      <span {...labelProps}>Ribbon</span>
    </div>
  )
}
