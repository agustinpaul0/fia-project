import type { TransactionalDatabase } from '../../core/db/client'
import { createRaceDriversReader } from './race-results.drivers.repository'
import type { RaceResultsRepository } from './race-results.port'
import { createRaceResultsReader } from './race-results.read.repository'
import { createSeasonResultsReader } from './race-results.standings.repository'
import { createRaceResultsWriter } from './race-results.write.repository'

export const createDrizzleRaceResultsRepository = (
  db: TransactionalDatabase,
): RaceResultsRepository => ({
  ...createRaceResultsReader(db),
  ...createRaceDriversReader(db),
  ...createSeasonResultsReader(db),
  ...createRaceResultsWriter(db),
})
