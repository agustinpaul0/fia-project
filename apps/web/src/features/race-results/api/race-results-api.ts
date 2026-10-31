import {
  type CancelRaceBody,
  type CircuitOption,
  circuitOptionListSchema,
  type DriverStanding,
  driverStandingListSchema,
  type EligibleDriver,
  eligibleDriverListSchema,
  RACE_CIRCUITS_PATH,
  type RaceClassification,
  type RaceClassificationBody,
  type RaceSummary,
  raceClassificationPath,
  raceClassificationSchema,
  raceDriversPath,
  racePath,
  raceSummaryListSchema,
  raceSummarySchema,
  racesOfSeasonPath,
  seasonStandingsPath,
  type UpdateRaceBody,
} from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export type SaveClassificationInput = {
  readonly raceId: string
  readonly body: RaceClassificationBody
}

export type SeasonScope = {
  readonly season: number
  readonly category: string | null
}

export const fetchSeasonRaces = ({
  season,
  category,
}: SeasonScope): Promise<readonly RaceSummary[]> =>
  apiRequest({ path: racesOfSeasonPath(season, category), schema: raceSummaryListSchema })

export const fetchSeasonStandings = ({
  season,
  category,
}: SeasonScope): Promise<readonly DriverStanding[]> =>
  apiRequest({ path: seasonStandingsPath(season, category), schema: driverStandingListSchema })

export const fetchRaceClassification = (raceId: string): Promise<RaceClassification> =>
  apiRequest({ path: raceClassificationPath(raceId), schema: raceClassificationSchema })

export const fetchRaceDrivers = (raceId: string): Promise<readonly EligibleDriver[]> =>
  apiRequest({ path: raceDriversPath(raceId), schema: eligibleDriverListSchema })

export const saveRaceClassification = ({
  raceId,
  body,
}: SaveClassificationInput): Promise<RaceClassification> =>
  apiRequest({
    path: raceClassificationPath(raceId),
    method: 'PUT',
    body,
    schema: raceClassificationSchema,
  })

export const updateScheduledRace = (raceId: string, body: UpdateRaceBody): Promise<RaceSummary> =>
  apiRequest({
    path: racePath(raceId),
    method: 'PUT',
    body,
    schema: raceSummarySchema,
  })

export const cancelScheduledRace = (raceId: string, body: CancelRaceBody): Promise<RaceSummary> =>
  apiRequest({
    path: racePath(raceId),
    method: 'DELETE',
    body,
    schema: raceSummarySchema,
  })

export const fetchCircuits = (): Promise<readonly CircuitOption[]> =>
  apiRequest({ path: RACE_CIRCUITS_PATH, schema: circuitOptionListSchema })
