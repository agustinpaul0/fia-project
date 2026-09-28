import {
  type EligibleDriver,
  eligibleDriverListSchema,
  type RaceClassification,
  type RaceClassificationBody,
  type RaceSummary,
  raceClassificationPath,
  raceClassificationSchema,
  raceDriversPath,
  raceSummaryListSchema,
  racesOfSeasonPath,
} from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export type SaveClassificationInput = {
  readonly raceId: string
  readonly body: RaceClassificationBody
}

export const fetchSeasonRaces = (year: number): Promise<readonly RaceSummary[]> =>
  apiRequest({ path: racesOfSeasonPath(year), schema: raceSummaryListSchema })

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
