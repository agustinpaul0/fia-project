import { drivers, races, teams, technicalControls } from '@fia/shared/db'
import { gt, type SQL } from 'drizzle-orm'
import { dateConditions, optionalEq } from '../../core/db/filter-conditions'
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

export const buildFilterConditions = (filter: TechnicalControlsListFilter): SQL[] => [
  gt(technicalControls.expiresAt, filter.activeAt),
  ...dateConditions(technicalControls.inspectedAt, filter),
  ...optionalEq(technicalControls.teamId, filter.teamId),
  ...optionalEq(technicalControls.driverId, filter.driverId),
  ...optionalEq(technicalControls.controlType, filter.controlType),
  ...optionalEq(technicalControls.status, filter.status),
]
