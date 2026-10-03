import type { SeasonScope } from './race-results-api'

export const RACES_QUERY_KEY = ['races'] as const

export const raceQueryKeys = {
  season: (scope: SeasonScope) =>
    [...RACES_QUERY_KEY, 'season', scope.season, scope.category] as const,
  standings: (scope: SeasonScope) =>
    [...RACES_QUERY_KEY, 'standings', scope.season, scope.category] as const,
  classification: (raceId: string) => [...RACES_QUERY_KEY, raceId, 'classification'] as const,
  drivers: (raceId: string) => [...RACES_QUERY_KEY, raceId, 'drivers'] as const,
}
