import { tmdb } from '@/lib/tmdb/api'
import button from '@/styles/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  async loader() {
    return {
      ...(await tmdb.movie.popular(1)),
    }
  },
})

function RouteComponent() {
  const { data, error } = Route.useLoaderData()
  if (error) return <h1>{error.status_message}</h1>
  return (
    <pre>
      <button className={button()}>Refresh</button>{' '}
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}
