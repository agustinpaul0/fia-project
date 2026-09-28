import type { RaceClassificationBody } from '@fia/shared/contracts'
import { AppError, pointsFor } from '@fia/shared/domain'
import type { DriverEligibility, RaceHeader, ScoredEntry } from './race-results.port'

const eligibleTeamId = (race: RaceHeader, driver: DriverEligibility | undefined): string => {
  if (driver === undefined) {
    throw new AppError('DRIVER_NOT_FOUND')
  }
  if (driver.teamId === null || driver.categoryId !== race.categoryId) {
    throw new AppError('DRIVER_NOT_IN_CATEGORY')
  }
  return driver.teamId
}

export const scoreEntries = (
  race: RaceHeader,
  body: RaceClassificationBody,
  drivers: readonly DriverEligibility[],
): readonly ScoredEntry[] => {
  const byId = new Map(drivers.map((driver) => [driver.id, driver]))
  return body.entries.map((entry, index) => ({
    driverId: entry.driverId,
    teamId: eligibleTeamId(race, byId.get(entry.driverId)),
    position: index + 1,
    points: pointsFor(race.type, index + 1),
  }))
}
