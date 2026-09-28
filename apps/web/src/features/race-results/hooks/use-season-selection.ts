import { useState } from 'react'
import { recentSeasons } from '@/lib/recent-seasons'

export type SeasonSelection = {
  readonly seasons: readonly number[]
  readonly season: number
  readonly setSeason: (season: number) => void
}

export const useSeasonSelection = (now: Date): SeasonSelection => {
  const seasons = recentSeasons(now)
  const [season, setSeason] = useState(seasons[1] ?? now.getFullYear())
  return { seasons, season, setSeason }
}
