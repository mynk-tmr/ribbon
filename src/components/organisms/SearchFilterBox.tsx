import { useMergedState } from '@/hooks/useMergedState'
import button from '@/styles/button'
import { getRouteApi } from '@tanstack/react-router'
import { InputField } from '../atoms/InputField'
import { SelectField } from '../atoms/SelectField'

export function SearchFilterBox() {
  const route = getRouteApi('/search')
  const search = route.useSearch()
  const goto = route.useNavigate()
  const [state, update] = useMergedState({
    query: search.query,
    media: search.media,
  })

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        goto({ search: { ...search, ...state } })
      }}
      className='flex flex-wrap justify-center gap-4'
    >
      <InputField
        required
        value={state.query}
        onValueChange={(query) => update({ query })}
        icon='mdi:magnify'
        placeholder='Search movies, TV shows...'
      />
      <SelectField
        required
        style={{ width: '8rem' }}
        value={state.media}
        onValueChange={(media) => update({ media })}
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
