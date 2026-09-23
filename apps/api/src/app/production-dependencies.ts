import { createBetterAuth } from '../core/auth/better-auth'
import { createBetterAuthSessionResolver } from '../core/auth/session'
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
}: ProductionContext): AppDependencies => {
  const auth = createBetterAuth({
    db,
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: [env.WEB_ORIGIN],
  })
  return {
    webOrigin: env.WEB_ORIGIN,
    logger,
    sessionResolver: createBetterAuthSessionResolver(auth),
    databasePing: createDatabasePing(db),
    repositories: { categories: createDrizzleCategoriesRepository(db) },
    auth,
  }
}
