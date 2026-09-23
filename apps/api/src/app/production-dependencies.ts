import { anonymousSessionResolver } from '../core/auth/session'
import type { Database } from '../core/db/client'
import { createDatabasePing } from '../core/db/ping'
import type { Logger } from '../core/logger'
import type { Env } from '../env'
import { createDrizzleCategoriesRepository } from '../features/categories/categories.repository'
import type { AppDependencies } from './app-dependencies'

export type ProductionContext = {
  readonly env: Env
  readonly db: Database
  readonly logger: Logger
}

export const createProductionDependencies = ({
  env,
  db,
  logger,
}: ProductionContext): AppDependencies => ({
  webOrigin: env.WEB_ORIGIN,
  logger,
  sessionResolver: anonymousSessionResolver,
  databasePing: createDatabasePing(db),
  repositories: { categories: createDrizzleCategoriesRepository(db) },
})
