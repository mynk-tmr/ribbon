import { useForm } from '@/hooks/useForm'
import button from '@/styles/button'
import { getRouteApi } from '@tanstack/react-router'
import { InputField } from '../atoms/InputField'
import { SelectField } from '../atoms/SelectField'

export function SearchFilterBox() {
  const route = getRouteApi('/search')
  const search = route.useSearch()
  const goto = route.useNavigate()

  const { values, update, isValid, errors } = useForm(
    {
      query: search.query,
      media: search.media,
    },
    (state) => ({
      query: state.query.trim() === '' ? 'This field is required' : '',
      media: '',
    }),
  )
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        console.log(values, isValid)
        if (!isValid) return
        const { query, media } = values
        goto({ search: { ...search, query, media } })
      }}
      className='flex flex-wrap justify-center gap-4'
    >
      <InputField
        value={values.query}
        onValueChange={(v) => update('query', v)}
        icon='mdi:magnify'
        placeholder='Search movies, TV shows...'
        error={errors.query}
      />
      <SelectField
        style={{ width: '8rem' }}
        value={values.media}
        onChange={(v) => update('media', v)}
        error={errors.media}
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
