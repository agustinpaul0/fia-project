import { raceResults } from '@fia/shared/db'
import type { DbExecutor } from '../core/db/executor'
import { F1_POINTS } from './base-data-races-definitions'

export type DriverSeedMap = Map<string, { id: string; teamId: string | null }>

export interface SeedResultParams {
  db: DbExecutor
  raceId: string
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
        points: F1_POINTS[i] ?? 0,
      })
      .onConflictDoNothing()
  }
}
