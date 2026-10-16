import { drivers, races, teams, technicalControls } from '@fia/shared/db'
import { eq, gt, gte, lte, type SQL } from 'drizzle-orm'
import type { TechnicalControlsListFilter } from './technical-controls.port'

export const technicalControlSelectFields = {
  id: technicalControls.id,
  teamId: technicalControls.teamId,
  teamName: teams.name,
  driverId: technicalControls.driverId,
  driverFirstName: drivers.firstName,
  driverLastName: drivers.lastName,
  carNumber: technicalControls.carNumber,
  raceId: technicalControls.raceId,
  raceName: races.name,
  controlType: technicalControls.controlType,
  status: technicalControls.status,
  notes: technicalControls.notes,
  inspectedAt: technicalControls.inspectedAt,
  expiresAt: technicalControls.expiresAt,
  version: technicalControls.version,
  createdAt: technicalControls.createdAt,
}

export const buildFilterConditions = (filter: TechnicalControlsListFilter): SQL[] => {
  const conditions: SQL[] = [gt(technicalControls.expiresAt, filter.activeAt)]
  if (filter.teamId) {
    conditions.push(eq(technicalControls.teamId, filter.teamId))
  }
  if (filter.controlType) {
    conditions.push(eq(technicalControls.controlType, filter.controlType))
  }
  if (filter.status) {
    conditions.push(eq(technicalControls.status, filter.status))
  }
  if (filter.season) {
    const start = new Date(Date.UTC(filter.season, 0, 1))
    const end = new Date(Date.UTC(filter.season, 11, 31, 23, 59, 59))
    conditions.push(
      gte(technicalControls.inspectedAt, start),
      lte(technicalControls.inspectedAt, end),
    )
  }
  return conditions
}
