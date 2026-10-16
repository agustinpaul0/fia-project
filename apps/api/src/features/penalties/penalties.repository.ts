import type { Penalty } from '@fia/shared/contracts'
import { drivers, penalties, races, teams } from '@fia/shared/db'
import { AppError } from '@fia/shared/domain'
import { and, desc, eq, gte, lte, type SQL } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import { translateConstraintViolations } from '../../core/errors/constraint-violations'
import { toPenaltyDto } from './penalties.mapper'
import type { PenaltiesListFilter, PenaltiesRepository } from './penalties.port'
import { PENALTY_CONSTRAINT_ERRORS } from './penalties-constraints'

const selectFields = {
  id: penalties.id,
  teamId: penalties.teamId,
  teamName: teams.name,
  driverId: penalties.driverId,
  driverFirstName: drivers.firstName,
  driverLastName: drivers.lastName,
  raceId: penalties.raceId,
  raceName: races.name,
  type: penalties.type,
  penalty: penalties.penalty,
  reason: penalties.reason,
  issuedAt: penalties.issuedAt,
  version: penalties.version,
  createdAt: penalties.createdAt,
}

const buildFilterConditions = (filter: PenaltiesListFilter): SQL[] => {
  const conditions: SQL[] = [gte(penalties.issuedAt, filter.issuedSince)]
  if (filter.teamId) {
    conditions.push(eq(penalties.teamId, filter.teamId))
  }
  if (filter.type) {
    conditions.push(eq(penalties.type, filter.type))
  }
  if (filter.season) {
    const start = new Date(Date.UTC(filter.season, 0, 1))
    const end = new Date(Date.UTC(filter.season, 11, 31, 23, 59, 59))
    conditions.push(gte(penalties.issuedAt, start), lte(penalties.issuedAt, end))
  }
  return conditions
}

const fetchPenaltyById = async (db: DbExecutor, id: string): Promise<Penalty> => {
  const [row] = await db
    .select(selectFields)
    .from(penalties)
    .innerJoin(teams, eq(penalties.teamId, teams.id))
    .leftJoin(drivers, eq(penalties.driverId, drivers.id))
    .leftJoin(races, eq(penalties.raceId, races.id))
    .where(eq(penalties.id, id))
    .limit(1)
  if (!row) {
    throw new AppError('INTERNAL_ERROR')
  }
  return toPenaltyDto(row)
}

export const createDrizzlePenaltiesRepository = (db: DbExecutor): PenaltiesRepository => ({
  list: async (filter) => {
    const conditions = buildFilterConditions(filter)
    const rows = await db
      .select(selectFields)
      .from(penalties)
      .innerJoin(teams, eq(penalties.teamId, teams.id))
      .leftJoin(drivers, eq(penalties.driverId, drivers.id))
      .leftJoin(races, eq(penalties.raceId, races.id))
      .where(and(...conditions))
      .orderBy(desc(penalties.issuedAt))
    return rows.map(toPenaltyDto)
  },
  create: async (body) =>
    translateConstraintViolations(PENALTY_CONSTRAINT_ERRORS, async () => {
      const [inserted] = await db
        .insert(penalties)
        .values({
          teamId: body.teamId,
          driverId: body.driverId ?? null,
          raceId: body.raceId ?? null,
          type: body.type,
          penalty: body.penalty,
          reason: body.reason,
          issuedAt: body.issuedAt ? new Date(body.issuedAt) : new Date(),
        })
        .returning({ id: penalties.id })
      if (!inserted) {
        throw new AppError('INTERNAL_ERROR')
      }
      return fetchPenaltyById(db, inserted.id)
    }),
  driverBelongsToTeam: async (driverId, teamId) => {
    const [row] = await db
      .select({ teamId: drivers.teamId })
      .from(drivers)
      .where(eq(drivers.id, driverId))
      .limit(1)
    return row?.teamId === teamId
  },
})
