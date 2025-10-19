import button from '@/styles/button'
import { headings } from '@/styles/typography'
import { Icon } from '@iconify/react'
import {
  Link,
  useRouter,
  type ErrorComponentProps,
} from '@tanstack/react-router'

export const ErrorBoundary: React.FC<ErrorComponentProps> = (props) => {
  const { error, info, reset } = props
  const router = useRouter()
  async function invalidateCache() {
    await router.invalidate({ sync: true })
    reset()
  }
  return (
    <main className='grid place-items-center space-y-9'>
      <Icon
        icon='mdi:bug'
        className='text-fireBrick/60'
        width={100}
        height={100}
      />
      <h1 className={headings({ level: 'h2', className: 'italic' })}>
        An unexpected error has occurred in this page
      </h1>
      <p className='bg-fireBrick/40 p-4 text-white'>{error.message}</p>
      <div className='flex gap-4'>
        <Link
          replace
          to='/'
          className={button({ intent: 'success', shape: 'pill' })}
        >
          Go to Home
        </Link>
        <button
          className={button({ intent: 'secondary', shape: 'pill' })}
          onClick={invalidateCache}
        >
          Refresh
        </button>
      </div>
      {import.meta.env.DEV && (
        <pre>
          <code>{JSON.stringify(info, null, 2)}</code>
        </pre>
      )}
    </main>
  )
}
