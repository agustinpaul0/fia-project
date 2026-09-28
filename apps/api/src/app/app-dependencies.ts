import type { BetterAuthInstance } from '../core/auth/better-auth'
import type { SessionResolver } from '../core/auth/session'
import type { DatabasePing } from '../core/db/ping'
import type { Logger } from '../core/logger'
import type { AuthHandler } from '../features/auth/auth.routes'
import type { CategoriesRepository } from '../features/categories/categories.port'
import type { NotificationsRepository } from '../features/notifications/notifications.port'
import type { RaceResultsRepository } from '../features/race-results/race-results.port'
import type { TeamStaffUnitOfWork } from '../features/team-staff/team-staff-unit-of-work.port'
import type { TeamsRepository } from '../features/teams/teams.port'

export type Repositories = {
  readonly categories: CategoriesRepository
  readonly teams?: TeamsRepository
  readonly teamStaffUow?: TeamStaffUnitOfWork
  readonly raceResults?: RaceResultsRepository
  readonly notifications?: NotificationsRepository
}

export type AppDependencies = {
  readonly webOrigin: string
  readonly logger: Logger
  readonly sessionResolver: SessionResolver
  readonly databasePing: DatabasePing
  readonly repositories: Repositories
  readonly auth?: BetterAuthInstance | AuthHandler
  readonly clock?: () => Date
}
