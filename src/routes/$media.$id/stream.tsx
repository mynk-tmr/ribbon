import { VidSrc } from '@/components/molecules/VidSrc'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$media/$id/stream')({
  component: RouteComponent,
})

function RouteComponent() {
  const { media, id } = Route.useParams()
  return (
    <main className='px-6 pt-8'>
      {media === 'movie' && <VidSrc type={media} id={id} />}
      {media === 'tv' && <em>Coming soon</em>}
    </main>
  )
}
