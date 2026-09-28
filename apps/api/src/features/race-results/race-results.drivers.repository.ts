import { drivers, teams } from '@fia/shared/db'
import { asc, eq, inArray } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import type { DriverEligibility, EligibleDriverRow } from './race-results.port'

export const createRaceDriversReader = (db: DbExecutor) => ({
  findDrivers: async (ids: readonly string[]): Promise<readonly DriverEligibility[]> =>
    db
      .select({ id: drivers.id, teamId: drivers.teamId, categoryId: teams.categoryId })
      .from(drivers)
      .leftJoin(teams, eq(teams.id, drivers.teamId))
      .where(inArray(drivers.id, [...ids])),
  listCategoryDrivers: async (categoryId: string): Promise<readonly EligibleDriverRow[]> => {
    const rows = await db
      .select({
        id: drivers.id,
        code: drivers.code,
        first: drivers.firstName,
        last: drivers.lastName,
        teamName: teams.name,
      })
      .from(drivers)
      .innerJoin(teams, eq(teams.id, drivers.teamId))
      .where(eq(teams.categoryId, categoryId))
      .orderBy(asc(teams.name), asc(drivers.lastName))
    return rows.map(({ first, last, ...row }) => ({ ...row, name: `${first} ${last}` }))
  },
})
