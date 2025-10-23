import { Icon } from '@iconify/react'

export function DefaultLoading() {
  return (
    <div className='mx-auto grid h-[calc(100vh-200px)] max-w-[400px] place-content-center gap-4'>
      <Icon icon='eos-icons:hourglass' className='mx-auto text-5xl' />
      <span>Verifying your identity...</span>
    </div>
  )
}
