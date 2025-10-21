import button from '@/styles/button'
import { getRouteApi } from '@tanstack/react-router'
import { useState } from 'react'
import { InputField } from '../atoms/InputField'
import { SelectField } from '../atoms/SelectField'

export function SearchFilterBox() {
  const route = getRouteApi('/search')
  const search = route.useSearch()
  const goto = route.useNavigate()

  const [query, setQuery] = useState(search.query)
  const [media, setMedia] = useState(search.media)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        goto({ search: { ...search, query, media } })
      }}
      className='flex flex-wrap justify-center gap-4'
    >
      <InputField
        required
        value={query}
        onValueChange={setQuery}
        icon='mdi:magnify'
        placeholder='Search movies, TV shows...'
      />
      <SelectField
        required
        style={{ width: '8rem' }}
        value={media}
        onValueChange={setMedia}
        options={
          [
            { label: '🎥 Movies', value: 'movie' },
            { label: '📺 TV Shows', value: 'tv' },
          ] as const
        }
      />
      <button
        className={button({ intent: 'info', className: 'self-start' })}
        type='submit'
      >
        Search
      </button>
    </form>
  )
}
