import {
  createRaceResultsService,
  type RaceResultsService,
} from '../features/race-results/race-results.service'
import {
  createInMemoryRaceResults,
  type InMemoryRaceResults,
} from './in-memory-race-results.repository'
import { aDriver, aRaceHeader, F2_CATEGORY_ID, someDrivers, TEST_NOW } from './race-builders'

export const RACE = aRaceHeader()
export const SPRINT = aRaceHeader({ id: '00000000-0000-4000-8000-000000000901', type: 'sprint' })
export const FUTURE_RACE = aRaceHeader({
  id: '00000000-0000-4000-8000-000000000902',
  date: new Date('2027-01-01T00:00:00.000Z'),
})
export const DRIVERS = someDrivers(12)
export const OTHER_CATEGORY_DRIVER = aDriver(20, { categoryId: F2_CATEGORY_ID })
export const DRIVER_WITHOUT_TEAM = aDriver(21, { teamId: null, categoryId: null })
export const MISSING_RACE_ID = '00000000-0000-4000-8000-000000000999'

export type RaceServiceFixture = {
  readonly repository: InMemoryRaceResults
  readonly service: RaceResultsService
}

export const createRaceServiceFixture = (): RaceServiceFixture => {
  const repository = createInMemoryRaceResults(
    [RACE, SPRINT, FUTURE_RACE],
    [...DRIVERS, OTHER_CATEGORY_DRIVER, DRIVER_WITHOUT_TEAM],
  )
  return { repository, service: createRaceResultsService({ repository, clock: () => TEST_NOW }) }
}
