import { useStore } from '@/lib/externs/sync-store'
import { $searches, RibbonDBActions } from '@/lib/indexdb/stores'
import badge from '@/styles/badge'
import { Icon } from '@iconify/react'
import { Link } from '@tanstack/react-router'

export function SearchHistory(props: { disableAll?: boolean }) {
  const searches = useStore($searches, (t) => t)
  return (
    <section className='mx-auto mt-8 flex w-fit max-w-lg flex-wrap gap-2'>
      {searches.map((item) => (
        <PillElement
          key={item.title}
          title={item.title}
          disabled={props.disableAll}
        />
      ))}
    </section>
  )
}

function PillElement(props: { title: string; disabled?: boolean }) {
  const [query, media] = props.title.split(' / ') as [string, 'movie' | 'tv']
  return (
    <Link
      disabled={props.disabled}
      to='/search'
      search={{ query, media }}
      className={badge({ intent: 'secondary', shape: 'pill', size: 'sm' })}
    >
      {props.title}
      <Icon
        role='button'
        className='ml-1'
        icon='mdi:close-circle-outline'
        onClick={() => {
          RibbonDBActions.remove('search', props.title)
        }}
      />
    </Link>
  )
}
