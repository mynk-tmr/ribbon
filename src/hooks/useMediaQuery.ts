import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(
    () => window.matchMedia(query).matches,
  )

  useEffect(() => {
    const matchMedia = window.matchMedia(query)
    const handler = () => setMatches(matchMedia.matches)
    matchMedia.addEventListener('change', handler)
    return () => matchMedia.removeEventListener('change', handler)
  }, [query])

  return matches
}
