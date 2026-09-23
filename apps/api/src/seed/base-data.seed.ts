import type { DbExecutor } from '../core/db/executor'
import { seedSeasonsAndCircuits, seedTeamsAndDrivers } from './base-data-entities.seed'
import { seedRacesAndResults } from './base-data-races.seed'

export const seedBaseData = async (db: DbExecutor): Promise<void> => {
  await seedSeasonsAndCircuits(db)
  await seedTeamsAndDrivers(db)
  await seedRacesAndResults(db)
}
