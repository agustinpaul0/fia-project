import type { UpdateTeamDriverBody } from '@fia/shared/contracts'
import { type DriverRow, drivers, teams } from '@fia/shared/db'
import { AppError } from '@fia/shared/domain'
import { and, asc, eq } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import { translateConstraintViolations } from '../../core/errors/constraint-violations'
import type { TeamDriversRepository } from './team-drivers.port'
import { DRIVER_CONSTRAINT_ERRORS } from './team-drivers-constraints'

const categoryOf = async (db: DbExecutor, teamId: string): Promise<string | null> => {
  const [team] = await db
    .select({ categoryId: teams.categoryId })
    .from(teams)
    .where(eq(teams.id, teamId))
    .limit(1)
  return team?.categoryId ?? null
}

const updateDriverRow = (
  db: DbExecutor,
  id: string,
  body: UpdateTeamDriverBody,
): Promise<DriverRow | null> =>
  translateConstraintViolations(DRIVER_CONSTRAINT_ERRORS, async () => {
    const { version, ...fields } = body
    const [updated] = await db
      .update(drivers)
      .set({ ...fields, version: version + 1, updatedAt: new Date() })
      .where(and(eq(drivers.id, id), eq(drivers.version, version)))
      .returning()
    return updated ?? null
  })

export const createDrizzleTeamDriversRepository = (db: DbExecutor): TeamDriversRepository => ({
  listAll: async () => db.select().from(drivers).orderBy(asc(drivers.number)),
  listByTeam: async (teamId) =>
    db.select().from(drivers).where(eq(drivers.teamId, teamId)).orderBy(asc(drivers.number)),
  findById: async (id) => {
    const [row] = await db.select().from(drivers).where(eq(drivers.id, id)).limit(1)
    return row ?? null
  },
  findByNumber: async (teamId, number) => {
    const categoryId = await categoryOf(db, teamId)
    if (categoryId === null) {
      return null
    }
    const [row] = await db
      .select()
      .from(drivers)
      .where(and(eq(drivers.number, number), eq(drivers.categoryId, categoryId)))
      .limit(1)
    return row ?? null
  },
  findByCode: async (code) => {
    const [row] = await db.select().from(drivers).where(eq(drivers.code, code)).limit(1)
    return row ?? null
  },
  countByTeamAndRole: async (teamId, role) => {
    const rows = await db
      .select({ id: drivers.id })
      .from(drivers)
      .where(and(eq(drivers.teamId, teamId), eq(drivers.role, role)))
    return rows.length
  },
  create: async (teamId, body) =>
    translateConstraintViolations(DRIVER_CONSTRAINT_ERRORS, async () => {
      const [created] = await db
        .insert(drivers)
        .values({ ...body, teamId, categoryId: await categoryOf(db, teamId) })
        .returning()
      if (!created) {
        throw new AppError('INTERNAL_ERROR')
      }
      return created
    }),
  update: (id, body) => updateDriverRow(db, id, body),
})
