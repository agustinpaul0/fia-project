import type { EligibleDriver, RaceClassification, RaceSummary } from '@fia/shared/contracts'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { raceQueryKeys } from '../api/race-query-keys'
import {
  fetchRaceClassification,
  fetchRaceDrivers,
  fetchSeasonRaces,
} from '../api/race-results-api'

export const useSeasonRaces = (year: number): UseQueryResult<readonly RaceSummary[]> =>
  useQuery({ queryKey: raceQueryKeys.season(year), queryFn: () => fetchSeasonRaces(year) })

export const useRaceClassification = (raceId: string): UseQueryResult<RaceClassification> =>
  useQuery({
    queryKey: raceQueryKeys.classification(raceId),
    queryFn: () => fetchRaceClassification(raceId),
  })

export const useRaceDrivers = (raceId: string): UseQueryResult<readonly EligibleDriver[]> =>
  useQuery({ queryKey: raceQueryKeys.drivers(raceId), queryFn: () => fetchRaceDrivers(raceId) })
