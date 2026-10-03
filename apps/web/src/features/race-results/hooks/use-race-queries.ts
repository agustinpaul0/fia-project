import type {
  DriverStanding,
  EligibleDriver,
  RaceClassification,
  RaceSummary,
} from '@fia/shared/contracts'
import { keepPreviousData, type UseQueryResult, useQuery } from '@tanstack/react-query'
import { raceQueryKeys } from '../api/race-query-keys'
import {
  fetchRaceClassification,
  fetchRaceDrivers,
  fetchSeasonRaces,
  fetchSeasonStandings,
  type SeasonScope,
} from '../api/race-results-api'

export const useSeasonRaces = (scope: SeasonScope): UseQueryResult<readonly RaceSummary[]> =>
  useQuery({
    queryKey: raceQueryKeys.season(scope),
    queryFn: () => fetchSeasonRaces(scope),
    placeholderData: keepPreviousData,
  })

export const useRaceClassification = (raceId: string): UseQueryResult<RaceClassification> =>
  useQuery({
    queryKey: raceQueryKeys.classification(raceId),
    queryFn: () => fetchRaceClassification(raceId),
  })

export const useRaceDrivers = (raceId: string): UseQueryResult<readonly EligibleDriver[]> =>
  useQuery({ queryKey: raceQueryKeys.drivers(raceId), queryFn: () => fetchRaceDrivers(raceId) })

export const useSeasonStandings = (scope: SeasonScope): UseQueryResult<readonly DriverStanding[]> =>
  useQuery({
    queryKey: raceQueryKeys.standings(scope),
    queryFn: () => fetchSeasonStandings(scope),
    placeholderData: keepPreviousData,
  })
