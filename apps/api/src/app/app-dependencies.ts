import type { SessionResolver } from '../core/auth/session'
import type { DatabasePing } from '../core/db/ping'
import type { Logger } from '../core/logger'
import type { CategoriesRepository } from '../features/categories/categories.port'

export type Repositories = {
  readonly categories: CategoriesRepository
}

export type AppDependencies = {
  readonly webOrigin: string
  readonly logger: Logger
  readonly sessionResolver: SessionResolver
  readonly databasePing: DatabasePing
  readonly repositories: Repositories
}
