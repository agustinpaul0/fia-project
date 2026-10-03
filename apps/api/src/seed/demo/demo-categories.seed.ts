import type { DbExecutor } from '../../core/db/executor'
import { seedRoster } from '../base-data-entities.seed'
import { seedCategoryRaces } from '../base-data-races.seed'
import { demoCalendar } from './demo-calendar'
import { DEMO_ROSTERS } from './demo-rosters'

export const seedDemoCategories = async (db: DbExecutor): Promise<readonly string[]> => {
  for (const roster of DEMO_ROSTERS) {
    await seedRoster(db, roster)
    const codes = roster.drivers.map((driver) => driver.code)
    const definitions = demoCalendar(roster.categoryCode, codes)
    await seedCategoryRaces(db, { categoryCode: roster.categoryCode, definitions })
  }
  return DEMO_ROSTERS.map((roster) => roster.categoryCode)
}
