import type { CreatePenaltyBody, Penalty } from '@fia/shared/contracts'
import { categories, drivers, penalties, races, teams } from '@fia/shared/db'
import { AppError } from '@fia/shared/domain'
import { and, desc, eq, gte, isNull, lte, type SQL } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import { translateConstraintViolations } from '../../core/errors/constraint-violations'
import { toPenaltyDto } from './penalties.mapper'
import type { PenaltiesListFilter, PenaltiesRepository } from './penalties.port'
import { penaltySelectFields as selectFields } from './penalties.select'
import { PENALTY_CONSTRAINT_ERRORS } from './penalties-constraints'

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

const findPenaltyRow = async (db: DbExecutor, id: string): Promise<Penalty | null> => {
  const [row] = await db
    .select(selectFields)
    .from(penalties)
    .innerJoin(teams, eq(penalties.teamId, teams.id))
    .innerJoin(categories, eq(teams.categoryId, categories.id))
    .leftJoin(drivers, eq(penalties.driverId, drivers.id))
    .leftJoin(races, eq(penalties.raceId, races.id))
    .where(eq(penalties.id, id))
    .limit(1)
  return row ? toPenaltyDto(row) : null
}

const insertPenaltyRow = (db: DbExecutor, body: CreatePenaltyBody): Promise<Penalty> =>
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
    const created = inserted ? await findPenaltyRow(db, inserted.id) : null
    if (!created) {
      throw new AppError('INTERNAL_ERROR')
    }
    return created
  })

export const createDrizzlePenaltiesRepository = (db: DbExecutor): PenaltiesRepository => ({
  list: async (filter) => {
    const rows = await db
      .select(selectFields)
      .from(penalties)
      .innerJoin(teams, eq(penalties.teamId, teams.id))
      .innerJoin(categories, eq(teams.categoryId, categories.id))
      .leftJoin(drivers, eq(penalties.driverId, drivers.id))
      .leftJoin(races, eq(penalties.raceId, races.id))
      .where(and(...buildFilterConditions(filter)))
      .orderBy(desc(penalties.issuedAt))
    return rows.map(toPenaltyDto)
  },
  findById: (id) => findPenaltyRow(db, id),
  create: (body) => insertPenaltyRow(db, body),
  confirm: async ({ id, userId, confirmedAt }) => {
    const [updated] = await db
      .update(penalties)
      .set({ confirmedAt, confirmedByUserId: userId, updatedAt: confirmedAt })
      .where(and(eq(penalties.id, id), isNull(penalties.confirmedAt)))
      .returning({ id: penalties.id })
    return updated ? findPenaltyRow(db, updated.id) : null
  },
  driverBelongsToTeam: async (driverId, teamId) => {
    const [row] = await db
      .select({ teamId: drivers.teamId })
      .from(drivers)
      .where(eq(drivers.id, driverId))
      .limit(1)
    return row?.teamId === teamId
  },
})
