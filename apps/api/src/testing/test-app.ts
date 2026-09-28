import type { TeamOption, TeamStaff } from '@fia/shared/contracts'
import type { CategoryRow } from '@fia/shared/db'
import type { Hono } from 'hono'
import { createApp } from '../app/create-app'
import type { BetterAuthInstance } from '../core/auth/better-auth'
import type { AppEnv, SessionUser } from '../core/auth/session'
import { type Logger, silentLogger } from '../core/logger'
import type { AuthHandler } from '../features/auth/auth.routes'
import type { RaceHeader } from '../features/race-results/race-results.port'
import type { TeamStaffUnitOfWork } from '../features/team-staff/team-staff-unit-of-work.port'
import type { TeamsRepository } from '../features/teams/teams.port'
import {
  createInMemoryCategoriesRepository,
  type InMemoryCategoriesRepository,
} from './in-memory-categories.repository'
import {
  createInMemoryRaceResults,
  type InMemoryRaceResults,
} from './in-memory-race-results.repository'
import { createInMemoryTeamStaffRepository } from './in-memory-team-staff.repository'
import { createInMemoryTeamStaffUnitOfWork } from './in-memory-team-staff-unit-of-work'
import { createInMemoryTeamsRepository } from './in-memory-teams.repository'
import { TEST_NOW, type TestDriver } from './race-builders'
import { fixedSessionResolver } from './session-users'

export const TEST_WEB_ORIGIN = 'http://localhost:5173'

export type TestAppOptions = {
  readonly sessionUser?: SessionUser | null
  readonly categories?: readonly CategoryRow[]
  readonly teams?: readonly TeamOption[]
  readonly staff?: readonly TeamStaff[]
  readonly databaseUp?: boolean
  readonly logger?: Logger
  readonly auth?: BetterAuthInstance | AuthHandler
  readonly teamStaffUow?: TeamStaffUnitOfWork
  readonly races?: readonly RaceHeader[]
  readonly drivers?: readonly TestDriver[]
}

export type TestApp = {
  readonly app: Hono<AppEnv>
  readonly categories: InMemoryCategoriesRepository
  readonly teams: TeamsRepository
  readonly teamStaffUow: TeamStaffUnitOfWork
  readonly raceResults: InMemoryRaceResults
}

export const createTestApp = (options: TestAppOptions = {}): TestApp => {
  const categories = createInMemoryCategoriesRepository(options.categories ?? [])
  const teams = createInMemoryTeamsRepository(options.teams ?? [])
  const staffRepo = createInMemoryTeamStaffRepository(options.staff ?? [])
  const teamStaffUow = options.teamStaffUow ?? createInMemoryTeamStaffUnitOfWork({ staffRepo })
  const raceResults = createInMemoryRaceResults(options.races ?? [], options.drivers ?? [])

  const app = createApp({
    webOrigin: TEST_WEB_ORIGIN,
    logger: options.logger ?? silentLogger,
    sessionResolver: fixedSessionResolver(options.sessionUser ?? null),
    databasePing: () => Promise.resolve(options.databaseUp ?? true),
    repositories: { categories, teams, teamStaffUow, raceResults },
    clock: () => TEST_NOW,
    ...(options.auth !== undefined ? { auth: options.auth } : {}),
  })
  return { app, categories, teams, teamStaffUow, raceResults }
}
