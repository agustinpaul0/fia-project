import type { Penalty, TeamOption, TeamStaff, TechnicalControl } from '@fia/shared/contracts'
import type { CategoryRow, DriverRow } from '@fia/shared/db'
import type { NotificationRecord } from '../features/notifications/notifications.port'
import type { RaceHeader } from '../features/race-results/race-results.port'
import type { TeamStaffUnitOfWork } from '../features/team-staff/team-staff-unit-of-work.port'
import { createInMemoryCategoriesRepository } from './in-memory-categories.repository'
import { createInMemoryNotifications } from './in-memory-notifications.repository'
import { createInMemoryPenaltiesRepository } from './in-memory-penalties.repository'
import { createInMemoryRaceResults } from './in-memory-race-results.repository'
import { createInMemoryTeamDriversRepository } from './in-memory-team-drivers.repository'
import { createInMemoryTeamStaffRepository } from './in-memory-team-staff.repository'
import { createInMemoryTeamStaffUnitOfWork } from './in-memory-team-staff-unit-of-work'
import { createInMemoryTeamsRepository } from './in-memory-teams.repository'
import { createInMemoryTechnicalControlsRepository } from './in-memory-technical-controls.repository'
import type { TestDriver } from './race-builders'

export type RepositoriesOptions = {
  readonly categories?: readonly CategoryRow[]
  readonly teams?: readonly TeamOption[]
  readonly staff?: readonly TeamStaff[]
  readonly teamStaffUow?: TeamStaffUnitOfWork
  readonly races?: readonly RaceHeader[]
  readonly drivers?: readonly TestDriver[]
  readonly notifications?: readonly NotificationRecord[]
  readonly teamDrivers?: readonly DriverRow[]
  readonly penalties?: readonly Penalty[]
  readonly technicalControls?: readonly TechnicalControl[]
}

export const createAllInMemoryRepositories = (options: RepositoriesOptions) => {
  const categories = createInMemoryCategoriesRepository(options.categories ?? [])
  const teams = createInMemoryTeamsRepository(options.teams ?? [])
  const staffRepo = createInMemoryTeamStaffRepository(options.staff ?? [])
  const teamStaffUow = options.teamStaffUow ?? createInMemoryTeamStaffUnitOfWork({ staffRepo })
  const raceResults = createInMemoryRaceResults(options.races ?? [], options.drivers ?? [])
  const notifications = createInMemoryNotifications(options.notifications ?? [])
  const teamDrivers = createInMemoryTeamDriversRepository(options.teamDrivers ?? [])
  const penalties = createInMemoryPenaltiesRepository(options.penalties ?? [])
  const technicalControls = createInMemoryTechnicalControlsRepository(
    options.technicalControls ?? [],
  )
  return {
    categories,
    teams,
    teamStaffUow,
    raceResults,
    notifications,
    teamDrivers,
    penalties,
    technicalControls,
  }
}
