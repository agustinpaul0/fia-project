import type { TechnicalControl } from '@fia/shared/contracts'
import { drivers, races, teams, technicalControls } from '@fia/shared/db'
import { AppError } from '@fia/shared/domain'
import { and, desc, eq } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import { toTechnicalControlDto } from './technical-controls.mapper'
import type { TechnicalControlsRepository } from './technical-controls.port'
import { buildFilterConditions, technicalControlSelectFields } from './technical-controls.sql'

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
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(technicalControls.inspectedAt))
    return rows.map(toTechnicalControlDto)
  },
  create: async (body) => {
    const [inserted] = await db
      .insert(technicalControls)
      .values({
        teamId: body.teamId,
        driverId: body.driverId ?? null,
        carNumber: body.carNumber ?? null,
        raceId: body.raceId ?? null,
        controlType: body.controlType,
        status: body.status,
        notes: body.notes ?? null,
        inspectedAt: body.inspectedAt ? new Date(body.inspectedAt) : new Date(),
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      })
      .returning({ id: technicalControls.id })
    if (!inserted) {
      throw new AppError('INTERNAL_ERROR')
    }
    return fetchById(db, inserted.id)
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
