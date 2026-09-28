export const RACES_QUERY_KEY = ['races'] as const

export const raceQueryKeys = {
  season: (year: number) => [...RACES_QUERY_KEY, 'season', year] as const,
  standings: (year: number) => [...RACES_QUERY_KEY, 'standings', year] as const,
  classification: (raceId: string) => [...RACES_QUERY_KEY, raceId, 'classification'] as const,
  drivers: (raceId: string) => [...RACES_QUERY_KEY, raceId, 'drivers'] as const,
}
