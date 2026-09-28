import { raceResults } from '@fia/shared/db'
import type { RaceType } from '@fia/shared/domain'
import { pointsFor } from '@fia/shared/domain'
import type { DbExecutor } from '../core/db/executor'

export type DriverSeedMap = Map<string, { id: string; teamId: string | null }>

export interface SeedResultParams {
  db: DbExecutor
  raceId: string
  type: RaceType
  results: readonly string[]
  driverMap: DriverSeedMap
}

export const seedRaceResults = async (p: SeedResultParams): Promise<void> => {
  for (let i = 0; i < p.results.length; i++) {
    const code = p.results[i]
    if (!code) {
      continue
    }
    const driver = p.driverMap.get(code)
    if (!driver?.teamId) {
      continue
    }
    await p.db
      .insert(raceResults)
      .values({
        raceId: p.raceId,
        driverId: driver.id,
        teamId: driver.teamId,
        position: i + 1,
        points: pointsFor(p.type, i + 1),
      })
      .onConflictDoNothing()
  }
}
