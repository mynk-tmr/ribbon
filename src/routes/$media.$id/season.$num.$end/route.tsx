import { tmdb } from '@/lib/tmdb/api'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/$media/$id/season/$num/$end')({
  async loader({ params: { id, num, end } }) {
    const number = Number(num) || 1
    const season = await tmdb.tv.season(id, number)
    return { season, number, end: Number(end) }
  },
  component: Outlet,
})
