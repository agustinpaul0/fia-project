import { type CircuitOption, type RaceListQuery, raceStatusSchema } from '@fia/shared/contracts'
import { categories, circuits, drivers, raceResults, races, seasons, teams } from '@fia/shared/db'
import { and, asc, eq, type SQL } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import type { ClassificationRow, RaceHeader } from './race-results.port'

const winner = { first: drivers.firstName, last: drivers.lastName }

export const seasonWhere = (query: RaceListQuery): SQL | undefined =>
  and(
    eq(seasons.year, query.season),
    query.category === undefined ? undefined : eq(categories.code, query.category),
  )

const selectRaceHeaders = (db: DbExecutor, where: SQL | undefined) =>
  db
    .select({
      id: races.id,
      name: races.name,
      type: races.type,
      round: races.round,
      date: races.date,
      seasonYear: seasons.year,
      categoryId: races.categoryId,
      categoryCode: categories.code,
      circuitId: races.circuitId,
      circuitName: circuits.name,
      status: races.status,
      version: races.version,
      resultsRevision: races.resultsRevision,
      winner,
    })
    .from(races)
    .innerJoin(seasons, eq(seasons.id, races.seasonId))
    .innerJoin(categories, eq(categories.id, races.categoryId))
    .innerJoin(circuits, eq(circuits.id, races.circuitId))
    .leftJoin(raceResults, and(eq(raceResults.raceId, races.id), eq(raceResults.position, 1)))
    .leftJoin(drivers, eq(drivers.id, raceResults.driverId))
    .where(where)
    .orderBy(asc(races.date), asc(races.type))

type HeaderRecord = Awaited<ReturnType<typeof selectRaceHeaders>>[number]

const toHeader = ({ winner: w, status, ...race }: HeaderRecord): RaceHeader => ({
  ...race,
  status: raceStatusSchema.parse(status),
  winnerName: w === null ? null : `${w.first} ${w.last}`,
})

export const createRaceResultsReader = (db: DbExecutor) => ({
  listCircuits: async (): Promise<readonly CircuitOption[]> =>
    db
      .select({ id: circuits.id, name: circuits.name, country: circuits.country })
      .from(circuits)
      .orderBy(asc(circuits.name)),
  listSeason: async (query: RaceListQuery): Promise<readonly RaceHeader[]> =>
    (await selectRaceHeaders(db, seasonWhere(query))).map(toHeader),
  findRace: async (id: string): Promise<RaceHeader | null> => {
    const [row] = await selectRaceHeaders(db, eq(races.id, id))
    return row === undefined ? null : toHeader(row)
  },
  findClassification: async (raceId: string): Promise<readonly ClassificationRow[]> => {
    const rows = await db
      .select({
        position: raceResults.position,
        driverId: raceResults.driverId,
        driverCode: drivers.code,
        first: drivers.firstName,
        last: drivers.lastName,
        teamId: raceResults.teamId,
        teamName: teams.name,
        points: raceResults.points,
      })
      .from(raceResults)
      .innerJoin(drivers, eq(drivers.id, raceResults.driverId))
      .innerJoin(teams, eq(teams.id, raceResults.teamId))
      .where(eq(raceResults.raceId, raceId))
      .orderBy(asc(raceResults.position))
    return rows.map(({ first, last, ...row }) => ({ ...row, driverName: `${first} ${last}` }))
  },
})
