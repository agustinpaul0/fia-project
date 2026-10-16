import { drivers } from '@fia/shared/db'
import { AppError } from '@fia/shared/domain'
import { and, asc, eq } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import { translateConstraintViolations } from '../../core/errors/constraint-violations'
import type { TeamDriversRepository } from './team-drivers.port'
import { DRIVER_CONSTRAINT_ERRORS } from './team-drivers-constraints'

export const createDrizzleTeamDriversRepository = (db: DbExecutor): TeamDriversRepository => ({
  listByTeam: async (teamId) =>
    db.select().from(drivers).where(eq(drivers.teamId, teamId)).orderBy(asc(drivers.number)),
  findByNumber: async (number) => {
    const [row] = await db.select().from(drivers).where(eq(drivers.number, number)).limit(1)
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
        .values({
          firstName: body.firstName,
          lastName: body.lastName,
          code: body.code,
          number: body.number,
          country: body.country,
          license: body.license,
          teamId,
          role: body.role,
        })
        .returning()
      if (!created) {
        throw new AppError('INTERNAL_ERROR')
      }
      return created
    }),
})
