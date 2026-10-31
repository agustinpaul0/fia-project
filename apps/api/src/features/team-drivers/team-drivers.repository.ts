import type { UpdateTeamDriverBody } from '@fia/shared/contracts'
import { type DriverRow, driverAccounts, drivers, teams } from '@fia/shared/db'
import { AppError } from '@fia/shared/domain'
import { and, asc, eq } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import { translateConstraintViolations } from '../../core/errors/constraint-violations'
import type { DriverWithTeam, TeamDriversRepository } from './team-drivers.port'
import { DRIVER_CONSTRAINT_ERRORS } from './team-drivers-constraints'

const categoryOf = async (db: DbExecutor, teamId: string): Promise<string | null> => {
  const [team] = await db
    .select({ categoryId: teams.categoryId })
    .from(teams)
    .where(eq(teams.id, teamId))
    .limit(1)
  return team?.categoryId ?? null
}

type DriverUpdate = {
  readonly id: string
  readonly body: UpdateTeamDriverBody
  readonly by: string
}

const updateDriverRow = (
  db: DbExecutor,
  { id, body, by }: DriverUpdate,
): Promise<DriverRow | null> =>
  translateConstraintViolations(DRIVER_CONSTRAINT_ERRORS, async () => {
    const { version, ...fields } = body
    const [updated] = await db
      .update(drivers)
      .set({ ...fields, updatedByUserId: by, version: version + 1, updatedAt: new Date() })
      .where(and(eq(drivers.id, id), eq(drivers.version, version)))
      .returning()
    return updated ?? null
  })

const listWithTeams = async (db: DbExecutor): Promise<readonly DriverWithTeam[]> =>
  (
    await db
      .select({ driver: drivers, teamName: teams.name, accountId: driverAccounts.id })
      .from(drivers)
      .leftJoin(teams, eq(drivers.teamId, teams.id))
      .leftJoin(
        driverAccounts,
        and(eq(driverAccounts.driverId, drivers.id), eq(driverAccounts.isActive, true)),
      )
      .orderBy(asc(teams.name), asc(drivers.number))
  ).map(({ driver, teamName, accountId }) => ({
    ...driver,
    teamName,
    hasOfficialAccount: accountId !== null,
  }))

export const createDrizzleTeamDriversRepository = (db: DbExecutor): TeamDriversRepository => ({
  listAll: () => listWithTeams(db),
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
  update: (id, body, by) => updateDriverRow(db, { id, body, by }),
})
