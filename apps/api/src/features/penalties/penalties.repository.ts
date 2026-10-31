import type { CreatePenaltyBody, Penalty } from '@fia/shared/contracts'
import { categories, drivers, penalties, races, teams, user } from '@fia/shared/db'
import { AppError } from '@fia/shared/domain'
import { and, eq, gte, isNull, type SQL } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import { dateConditions, dateOrder, optionalEq } from '../../core/db/filter-conditions'
import { translateConstraintViolations } from '../../core/errors/constraint-violations'
import { toPenaltyDto } from './penalties.mapper'
import type { PenaltiesListFilter, PenaltiesRepository } from './penalties.port'
import { penaltySelectFields as selectFields } from './penalties.select'
import { PENALTY_CONSTRAINT_ERRORS } from './penalties-constraints'

const buildFilterConditions = (filter: PenaltiesListFilter): SQL[] => [
  gte(penalties.issuedAt, filter.issuedSince),
  ...dateConditions(penalties.issuedAt, filter),
  ...optionalEq(penalties.teamId, filter.teamId),
  ...optionalEq(penalties.driverId, filter.driverId),
  ...optionalEq(penalties.type, filter.type),
]

const findPenaltyRow = async (db: DbExecutor, id: string): Promise<Penalty | null> => {
  const [row] = await db
    .select(selectFields)
    .from(penalties)
    .innerJoin(teams, eq(penalties.teamId, teams.id))
    .innerJoin(categories, eq(teams.categoryId, categories.id))
    .leftJoin(drivers, eq(penalties.driverId, drivers.id))
    .leftJoin(races, eq(penalties.raceId, races.id))
    .leftJoin(user, eq(penalties.confirmedByUserId, user.id))
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
      .leftJoin(user, eq(penalties.confirmedByUserId, user.id))
      .where(and(...buildFilterConditions(filter)))
      .orderBy(dateOrder(penalties.issuedAt, filter.sort))
    return rows.map(toPenaltyDto)
  },
  findById: (id) => findPenaltyRow(db, id),
  create: (body) => insertPenaltyRow(db, body),
  confirm: async ({ id, userId, confirmedAt, version }) => {
    const [updated] = await db
      .update(penalties)
      .set({
        confirmedAt,
        confirmedByUserId: userId,
        updatedAt: confirmedAt,
        version: version + 1,
      })
      .where(
        and(eq(penalties.id, id), eq(penalties.version, version), isNull(penalties.confirmedAt)),
      )
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
