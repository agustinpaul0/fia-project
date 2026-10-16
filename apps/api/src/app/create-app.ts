import { API_PATHS } from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import { Hono } from 'hono'
import { type AppEnv, resolveSession } from '../core/auth/session'
import { toErrorBody } from '../core/errors/error-body'
import { createErrorHandler } from '../core/errors/error-handler'
import { securityMiddlewares } from '../core/security/security-middlewares'
import { createAuthRoutes } from '../features/auth/auth.routes'
import { createCategoriesRoutes } from '../features/categories/categories.routes'
import { createCategoriesService } from '../features/categories/categories.service'
import { createHealthRoutes } from '../features/health/health.routes'
import { createNotificationsRoutes } from '../features/notifications/notifications.routes'
import { createNotificationsService } from '../features/notifications/notifications.service'
import { createPenaltiesRoutes } from '../features/penalties/penalties.routes'
import { createPenaltiesService } from '../features/penalties/penalties.service'
import { createRaceResultsRoutes } from '../features/race-results/race-results.routes'
import { createRaceResultsService } from '../features/race-results/race-results.service'
import { createTeamDriversRoutes } from '../features/team-drivers/team-drivers.routes'
import { createTeamDriversService } from '../features/team-drivers/team-drivers.service'
import { createTeamStaffRoutes } from '../features/team-staff/team-staff.routes'
import { createTeamStaffService } from '../features/team-staff/team-staff.service'
import { createTeamsRoutes } from '../features/teams/teams.routes'
import { createTeamsService } from '../features/teams/teams.service'
import type { AppDependencies } from './app-dependencies'

export const createApp = (deps: AppDependencies): Hono<AppEnv> => {
  const app = new Hono<AppEnv>()
  app.use(...securityMiddlewares(deps.webOrigin))
  app.use(resolveSession(deps.sessionResolver))
  app.route(API_PATHS.health, createHealthRoutes(deps.databasePing))
  if (deps.auth) {
    app.route(API_PATHS.auth, createAuthRoutes(deps.auth))
  }
  app.route(
    API_PATHS.categories,
    createCategoriesRoutes(createCategoriesService(deps.repositories.categories)),
  )
  if (deps.repositories.teams) {
    app.route(API_PATHS.teams, createTeamsRoutes(createTeamsService(deps.repositories.teams)))
  }
  if (deps.repositories.teamStaffUow && deps.repositories.teams) {
    app.route(
      API_PATHS.teamStaff,
      createTeamStaffRoutes(
        createTeamStaffService({
          uow: deps.repositories.teamStaffUow,
          teams: deps.repositories.teams,
        }),
      ),
    )
  }
  const clock = deps.clock ?? (() => new Date())
  if (deps.repositories.raceResults) {
    const service = createRaceResultsService({ repository: deps.repositories.raceResults, clock })
    app.route(API_PATHS.races, createRaceResultsRoutes(service))
  }
  if (deps.repositories.notifications) {
    const service = createNotificationsService({
      repository: deps.repositories.notifications,
      clock,
    })
    app.route(API_PATHS.notifications, createNotificationsRoutes(service))
  }
  if (deps.repositories.teamDrivers) {
    const service = createTeamDriversService(deps.repositories.teamDrivers)
    app.route(API_PATHS.teamDrivers, createTeamDriversRoutes(service))
  }
  if (deps.repositories.penalties) {
    const service = createPenaltiesService(deps.repositories.penalties)
    app.route(API_PATHS.penalties, createPenaltiesRoutes(service))
  }
  app.notFound((c) => c.json(toErrorBody(new AppError('ROUTE_NOT_FOUND')), { status: 404 }))
  app.onError(createErrorHandler(deps.logger))
  return app
}
