import { teamStaff, teams, user } from '@fia/shared/db'
import { and, asc, eq } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import { firstOrThrow } from '../../core/db/first-or-throw'
import { translateConstraintViolations } from '../../core/errors/constraint-violations'
import { toTeamStaffDto } from './team-staff.mapper'
import type {
  CreateTeamStaffRecord,
  DeactivateTeamStaffRecord,
  TeamStaffRepository,
  UpdateTeamStaffRecord,
} from './team-staff.port'
import { STAFF_CONSTRAINT_ERRORS } from './team-staff-constraints'

const selectJoinedStaff = (db: DbExecutor) =>
  db
    .select({ staff: teamStaff, userEmail: user.email, teamName: teams.name })
    .from(teamStaff)
    .innerJoin(user, eq(teamStaff.userId, user.id))
    .innerJoin(teams, eq(teamStaff.teamId, teams.id))

const createStaffQueries = (db: DbExecutor) => ({
  findAll: async () => {
    const rows = await selectJoinedStaff(db).orderBy(
      asc(teamStaff.lastName),
      asc(teamStaff.firstName),
      asc(teamStaff.id),
    )
    return rows.map(toTeamStaffDto)
  },
  findById: async (id: string) => {
    const rows = await selectJoinedStaff(db).where(eq(teamStaff.id, id)).limit(1)
    return rows[0] ? toTeamStaffDto(rows[0]) : null
  },
  findByFileNumber: async (fn: string) => {
    const rows = await selectJoinedStaff(db).where(eq(teamStaff.fileNumber, fn)).limit(1)
    return rows[0] ? toTeamStaffDto(rows[0]) : null
  },
  findByUserId: async (uid: string) => {
    const rows = await selectJoinedStaff(db).where(eq(teamStaff.userId, uid)).limit(1)
    return rows[0] ? toTeamStaffDto(rows[0]) : null
  },
})

const createStaffMutations = (
  db: DbExecutor,
  findById: (id: string) => Promise<ReturnType<typeof toTeamStaffDto> | null>,
) => ({
  create: async (input: CreateTeamStaffRecord) =>
    translateConstraintViolations(STAFF_CONSTRAINT_ERRORS, async () => {
      const inserted = firstOrThrow(await db.insert(teamStaff).values(input).returning())
      const item = await findById(inserted.id)
      return firstOrThrow(item ? [item] : [])
    }),
  update: async (id: string, input: UpdateTeamStaffRecord) =>
    translateConstraintViolations(STAFF_CONSTRAINT_ERRORS, async () => {
      const rows = await db
        .update(teamStaff)
        .set({
          firstName: input.firstName,
          lastName: input.lastName,
          roleInTeam: input.roleInTeam,
          phoneNumber: input.phoneNumber,
          teamId: input.teamId,
          version: input.version + 1,
        })
        .where(and(eq(teamStaff.id, id), eq(teamStaff.version, input.version)))
        .returning()
      return rows[0] ? findById(id) : null
    }),
  deactivate: async (id: string, input: DeactivateTeamStaffRecord) => {
    const rows = await db
      .update(teamStaff)
      .set({
        isActive: false,
        deactivatedAt: input.deactivatedAt,
        deactivatedBy: input.deactivatedBy,
        version: input.version + 1,
      })
      .where(and(eq(teamStaff.id, id), eq(teamStaff.version, input.version)))
      .returning()
    return rows[0] ? findById(id) : null
  },
})

export const createDrizzleTeamStaffRepository = (db: DbExecutor): TeamStaffRepository => {
  const queries = createStaffQueries(db)
  return { ...queries, ...createStaffMutations(db, queries.findById) }
}
