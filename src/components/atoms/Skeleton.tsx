export function Skeleton() {
  return (
    <div role='status' className='max-w-sm animate-pulse'>
      <div className='bg-lightGray mb-4 h-2.5 w-48 rounded-full'></div>
      <div className='bg-lightGray mb-2.5 h-2 max-w-[360px] rounded-full'></div>
      <div className='bg-lightGray mb-2.5 h-2 rounded-full'></div>
      <div className='bg-lightGray mb-2.5 h-2 max-w-[330px] rounded-full'></div>
      <div className='bg-lightGray mb-2.5 h-2 max-w-[300px] rounded-full'></div>
      <div className='bg-lightGray h-2 max-w-[360px] rounded-full'></div>
      <span className='sr-only'>Loading...</span>
    </div>
  )
}
