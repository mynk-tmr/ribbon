export const FmtDate = (date: string) => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date))
  } catch {
    return 'N/A'
  }
}

export const FmtAge = (date: string) => {
  const age = Date.now() - new Date(date).getTime()
  const years = age / 1000 / 60 / 60 / 24 / 365
  return Math.floor(years)
}

export const FmtPopularity = (value: number, shorten = false) => {
  const pop = Math.floor(value * 100)
  if (!pop) return '0'
  if (!shorten) return `${pop}`
  const K = Math.floor(pop / 100)
  return K === 0 ? `${pop}` : `${K}K`
}

export const FmtYear = (date: string | undefined) => {
  return date ? new Date(date).getFullYear() : 'N/A'
}

export const FmtPlural = (i: number, prefix: string) =>
  i > 1 ? `${i} ${prefix}s` : `${i} ${prefix}`

export const FmtHour = (i: number | null) => {
  if (i === null) return 'N/A'
  const h = Math.floor(i / 60)
  const m = i % 60
  return h > 0 ? `${h} h ${m} min` : `${m} min`
}

export const FmtTrunc = (str: string, max: number) => {
  return str.length > max ? `${str.slice(0, max - 3)}...` : str
}

export const FmtTitle = (str: string) => {
  return str.replace(/[-_](\w)/g, (_, c) => ` ${c.toUpperCase()}`)
}
