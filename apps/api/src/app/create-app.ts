import { API_PATHS } from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import { Hono } from 'hono'
import { type AppEnv, resolveSession } from '../core/auth/session'
import { toErrorBody } from '../core/errors/error-body'
import { createErrorHandler } from '../core/errors/error-handler'
import { securityMiddlewares } from '../core/security/security-middlewares'
import { createCategoriesRoutes } from '../features/categories/categories.routes'
import { createCategoriesService } from '../features/categories/categories.service'
import { createHealthRoutes } from '../features/health/health.routes'
import type { AppDependencies } from './app-dependencies'

export const createApp = (deps: AppDependencies): Hono<AppEnv> => {
  const app = new Hono<AppEnv>()
  app.use(...securityMiddlewares(deps.webOrigin))
  app.use(resolveSession(deps.sessionResolver))
  app.route(API_PATHS.health, createHealthRoutes(deps.databasePing))
  app.route(
    API_PATHS.categories,
    createCategoriesRoutes(createCategoriesService(deps.repositories.categories)),
  )
  app.notFound((c) => c.json(toErrorBody(new AppError('ROUTE_NOT_FOUND')), { status: 404 }))
  app.onError(createErrorHandler(deps.logger))
  return app
}
