import type { TechnicalControl } from '@fia/shared/contracts'
import { drivers, races, teams, technicalControls } from '@fia/shared/db'
import { AppError } from '@fia/shared/domain'
import { and, desc, eq } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import { translateConstraintViolations } from '../../core/errors/constraint-violations'
import { toTechnicalControlDto } from './technical-controls.mapper'
import type { TechnicalControlsRepository } from './technical-controls.port'
import { buildFilterConditions, technicalControlSelectFields } from './technical-controls.sql'
import { TECHNICAL_CONTROL_CONSTRAINT_ERRORS } from './technical-controls-constraints'

const fetchById = async (db: DbExecutor, id: string): Promise<TechnicalControl> => {
  const [row] = await db
    .select(technicalControlSelectFields)
    .from(technicalControls)
    .innerJoin(teams, eq(technicalControls.teamId, teams.id))
    .leftJoin(drivers, eq(technicalControls.driverId, drivers.id))
    .leftJoin(races, eq(technicalControls.raceId, races.id))
    .where(eq(technicalControls.id, id))
    .limit(1)
  if (!row) {
    throw new AppError('INTERNAL_ERROR')
  }
  return toTechnicalControlDto(row)
}

export const createDrizzleTechnicalControlsRepository = (
  db: DbExecutor,
): TechnicalControlsRepository => ({
  list: async (filter) => {
    const conditions = buildFilterConditions(filter)
    const rows = await db
      .select(technicalControlSelectFields)
      .from(technicalControls)
      .innerJoin(teams, eq(technicalControls.teamId, teams.id))
      .leftJoin(drivers, eq(technicalControls.driverId, drivers.id))
      .leftJoin(races, eq(technicalControls.raceId, races.id))
      .where(and(...conditions))
      .orderBy(desc(technicalControls.inspectedAt))
    return rows.map(toTechnicalControlDto)
  },
  create: async (body) =>
    translateConstraintViolations(TECHNICAL_CONTROL_CONSTRAINT_ERRORS, async () => {
      const [inserted] = await db
        .insert(technicalControls)
        .values({
          teamId: body.teamId,
          driverId: body.driverId ?? null,
          carNumber: body.carNumber,
          raceId: body.raceId ?? null,
          controlType: body.controlType,
          status: body.status,
          notes: body.notes ?? null,
          inspectedAt: new Date(body.inspectedAt),
          expiresAt: new Date(body.expiresAt),
        })
        .returning({ id: technicalControls.id })
      if (!inserted) {
        throw new AppError('INTERNAL_ERROR')
      }
      return fetchById(db, inserted.id)
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
