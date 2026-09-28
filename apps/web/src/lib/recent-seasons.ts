export const RECENT_SEASONS_COUNT = 6

export const recentSeasons = (now: Date, count = RECENT_SEASONS_COUNT): readonly number[] =>
  Array.from({ length: count }, (_, index) => now.getFullYear() - index)
