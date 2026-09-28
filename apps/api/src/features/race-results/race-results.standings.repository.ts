import { drivers, raceResults, races, seasons, teams } from '@fia/shared/db'
import { eq } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import type { SeasonResultRow } from './race-results.port'

export const createSeasonResultsReader = (db: DbExecutor) => ({
  listSeasonResults: async (year: number): Promise<readonly SeasonResultRow[]> => {
    const rows = await db
      .select({
        driverId: raceResults.driverId,
        driverCode: drivers.code,
        first: drivers.firstName,
        last: drivers.lastName,
        teamName: teams.name,
        position: raceResults.position,
        points: raceResults.points,
      })
      .from(raceResults)
      .innerJoin(races, eq(races.id, raceResults.raceId))
      .innerJoin(seasons, eq(seasons.id, races.seasonId))
      .innerJoin(drivers, eq(drivers.id, raceResults.driverId))
      .innerJoin(teams, eq(teams.id, raceResults.teamId))
      .where(eq(seasons.year, year))
    return rows.map(({ first, last, ...row }) => ({ ...row, driverName: `${first} ${last}` }))
  },
})
