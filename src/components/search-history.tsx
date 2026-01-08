import { Icon } from '@iconify/react'
import { Button } from '@mantine/core'
import { useStore } from '@nanostores/react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { searchStore } from '@/application/stores/search.store'

export default function SearchHistory() {
  const searches = useStore(searchStore.store)
  const [clearing, setClearing] = useState(false)
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set())

  const onClear = async () => {
    setClearing(true)
    try {
      await searchStore.clear()
    } finally {
      setClearing(false)
    }
  }

  const onRemove = async (id: string) => {
    setRemovingIds((prev) => new Set(prev).add(id))
    try {
      await searchStore.remove(id)
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  return (
    <>
      <div className="w-full">
        {searches.length > 0 && (
          <Button
            size="compact-xs"
            bg="red"
            onClick={onClear}
            disabled={clearing}
            loading={clearing}
          >
            Clear History
          </Button>
        )}
      </div>
      {searches.length < 1 ? (
        <p className="text-sm text-gray-400">No search history found.</p>
      ) : (
        searches.map((term) => (
          <div
            key={term._id}
            className="p-2 w-[calc(50%-0.75rem)] sm:w-28 bg-black/60 border rounded-md grid relative"
          >
            <Link
              to="/search"
              search={{ query: term.query, by: term.entity, page: 1 }}
              className="font-medium flex items-center gap-2 truncate text-xs"
            >
              {term.query}{' '}
              <Icon
                icon={
                  term.entity === 'movie'
                    ? 'mdi:movie'
                    : term.entity === 'tv'
                      ? 'mdi:television-box'
                      : 'mdi:account'
                }
              />
            </Link>
            <span className="text-[10px] text-gray-400">
              {new Date(term.addedAt).toLocaleDateString()}
            </span>
            <button
              type="button"
              className="absolute -top-1 -right-2 cursor-pointer disabled:opacity-50"
              onClick={() => onRemove(term._id)}
              disabled={removingIds.has(term._id) || clearing}
            >
              <Icon
                icon="clarity:remove-solid"
                className={
                  removingIds.has(term._id)
                    ? 'text-gray-400 animate-spin'
                    : 'text-red-500'
                }
              />
            </button>
          </div>
        ))
      )}
    </>
  )
}
