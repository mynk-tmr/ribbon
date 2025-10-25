import { Icon } from '@iconify/react'
import { Button } from '@mantine/core'
import { type ErrorRouteComponent, Link } from '@tanstack/react-router'
import { tmdb } from '@/config/tmdb'

export const ShowError: ErrorRouteComponent = (props) => {
  return (
    <main className="page space-y-9">
      <header className="flex items-center justify-center text-red-400">
        <Icon icon="mdi:bug" className="text-5xl inline mr-4" />
        <h1 className="font-bold text-3xl">
          {tmdb.isError(props.error) ? 'API Error' : 'Oops'}
        </h1>
      </header>
      <p className="max-w-lg text-center">
        Something went wrong. You can recover by picking one of the following. If
        Refresh does not work, try going Home. If that does not work, reopen the app.
      </p>
      <div className="flex justify-center gap-4">
        <Button size="xs" color="teal" onClick={props.reset}>
          Refresh
        </Button>
        <Button size="xs" variant="white" color="black" component={Link} to="/">
          Go Home
        </Button>
      </div>
    </main>
  )
}
