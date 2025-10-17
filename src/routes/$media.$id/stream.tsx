import { VidSrc } from '@/components/molecules/VidSrc'
import { link } from '@/styles/typography'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/$media/$id/stream')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return (
    <main className='px-6 pt-8'>
      <VidSrc type='movie' id={id} />
      <div className='mx-auto w-fit'>
        <BackButton />
      </div>
    </main>
  )
}

function BackButton() {
  const params = Route.useParams()
  return (
    <Link
      className={link({
        class: 'hover:border-b-lightGray hover:border-b',
      })}
      replace
      to='/$media/$id/overview/$similar'
      params={{ media: 'movie', id: params.id, similar: 1 }}
    >
      &larr; Back to Movie
    </Link>
  )
}
