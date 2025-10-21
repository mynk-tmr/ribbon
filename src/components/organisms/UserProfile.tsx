import { useAuth } from '@/lib/firebase/hooks'
import { poster } from '@/styles/media'
import { Icon } from '@iconify/react'

export function UserProfile() {
  const { user } = useAuth()
  if (!user) throw new Error('User not found')

  const avatar =
    user.photoURL ||
    `https://api.dicebear.com/8.x/adventurer/svg?seed=${encodeURIComponent(
      user.displayName || user.email || 'User',
    )}`

  return (
    <article className='grid justify-center gap-4'>
      {/* Avatar */}
      <img
        src={avatar}
        alt='Profile'
        className={poster({
          class: 'mx-auto size-24 rounded-full',
          withBorder: true,
        })}
      />

      {/* User info */}
      <div className='space-y-2 text-center'>
        <h2 className='text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100'>
          {user.displayName || 'Anonymous User'}
        </h2>
        <p className='flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
          <em>{user.email}</em>
          {user.emailVerified ? (
            <Icon
              icon='material-symbols:verified'
              className='text-blue-500'
              width={20}
              height={20}
            />
          ) : (
            <Icon
              icon='mdi:lock-question'
              className='text-gray-400'
              width={20}
              height={20}
            />
          )}
        </p>
      </div>
    </article>
  )
}
