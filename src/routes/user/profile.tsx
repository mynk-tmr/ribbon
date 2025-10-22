import { linkToDiceBear } from '@/lib/externs/dicebear'
import { useFireAuth } from '@/lib/firebase/store'
import { card, poster } from '@/styles/media'
import { headings } from '@/styles/typography'
import { Icon } from '@iconify/react'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/user/profile')({
  component: UserProfile,
})

export function UserProfile() {
  return (
    <article className={card()}>
      <Introduction />
      <Outlet />
    </article>
  )
}

function Introduction() {
  const { USER } = useFireAuth()
  const avatar = linkToDiceBear(USER.uid)
  const emailVerifiedIcon = (
    <Icon
      className='inline-block align-text-bottom'
      icon={USER.emailVerified ? 'material-symbols:verified' : 'mdi:lock'}
    />
  )

  return (
    <header className='flex items-center gap-4'>
      <img
        src={avatar}
        alt='App generated avatar'
        className={poster({ class: 'size-24 rounded-full', withBorder: true })}
      />
      <div className='grid gap-y-2'>
        <span className={headings({ level: 'h4' })}>
          Hello, {USER.displayName ?? 'Anon'}
        </span>
        <small className='text-silver'>
          {USER.email} {emailVerifiedIcon}
        </small>
      </div>
    </header>
  )
}
