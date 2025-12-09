import { Icon } from '@iconify/react'
import { Button } from '@mantine/core'
import {
  type ErrorRouteComponent,
  Link,
  Navigate,
  useRouter,
} from '@tanstack/react-router'
import { FetchError } from 'ofetch'

export const ShowError: ErrorRouteComponent = (props) => {
  const router = useRouter()
  const reload = async () => {
    await router.invalidate({ sync: true })
    props.reset()
  }
  const isNotFound =
    props.error instanceof FetchError && props.error.status === 404
  const isAPIError =
    props.error instanceof FetchError && props.error.status !== 404
  if (isNotFound) {
    //@ts-expect-error
    return <Navigate to="/404" replace />
  }
  return (
    <main className="page space-y-9">
      <header className="flex items-center justify-center text-red-400">
        <Icon icon="mdi:bug" className="text-5xl inline mr-4" />
        <h1 className="font-bold text-3xl">
          {isAPIError ? 'Server Error' : 'Oops'}
        </h1>
      </header>
      <p className="max-w-lg text-center">
        Something went wrong. You can recover by picking one of the following.
        If Refresh does not work, try going Home. If that does not work, reopen
        the app.
      </p>
      <div className="flex justify-center gap-4">
        <Button size="xs" color="yellow" onClick={reload}>
          Refresh
        </Button>
        <Button replace size="xs" color="teal" component={Link} to="/">
          Go Home
        </Button>
      </div>
    </main>
  )
}
