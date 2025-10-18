import button from '@/styles/button'
import { useState } from 'react'
import { InputField } from '../atoms/InputField'
import { SelectField } from '../atoms/SelectField'

interface Props {
  defaults: {
    media: 'movie' | 'tv'
    year?: number
    query: string
  }
  onSearch: (query: string, media: 'movie' | 'tv', year?: number) => void
}

export function SearchFilterBox(props: Props) {
  const [media, setMedia] = useState<'movie' | 'tv'>(props.defaults.media)
  const [year, setYear] = useState<number | undefined>(props.defaults.year)
  const [query, setQuery] = useState(props.defaults.query)
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        props.onSearch(query, media, year)
      }}
      className='flex flex-wrap justify-center gap-4'
    >
      <InputField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        required
        style={{ width: '20rem' }}
        icon='mdi:magnify'
        placeholder='Search movies, TV shows...'
      />
      <SelectField
        required
        style={{ width: '8rem' }}
        value={media}
        onChange={setMedia}
        options={
          [
            { label: '🎥 Movies', value: 'movie' },
            { label: '📺 TV Shows', value: 'tv' },
          ] as const
        }
      />
      <InputField
        placeholder='Year'
        type='number'
        min={1920}
        max={new Date().getFullYear()}
        style={{ width: '6rem' }}
        icon='mdi:calendar'
        value={year}
        onChange={(e) => {
          const val = e.target.valueAsNumber
          setYear(val > 0 ? val : undefined)
        }}
      />
      <button className={button({ intent: 'info' })} type='submit'>
        Search
      </button>
    </form>
  )
}
