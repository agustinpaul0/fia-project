import type { Hono } from 'hono'
import { createApp } from '../app/create-app'
import type { BetterAuthInstance } from '../core/auth/better-auth'
import type { AppEnv, SessionUser } from '../core/auth/session'
import { type Logger, silentLogger } from '../core/logger'
import type { AuthHandler } from '../features/auth/auth.routes'
import { createAllInMemoryRepositories, type RepositoriesOptions } from './in-memory-repositories'
import { TEST_NOW } from './race-builders'
import { fixedSessionResolver } from './session-users'

export const TEST_WEB_ORIGIN = 'http://localhost:5173'

export type TestAppOptions = RepositoriesOptions & {
  readonly sessionUser?: SessionUser | null
  readonly databaseUp?: boolean
  readonly logger?: Logger
  readonly auth?: BetterAuthInstance | AuthHandler
  readonly sharedRepositories?: ReturnType<typeof createAllInMemoryRepositories>
}

export type TestApp = ReturnType<typeof createAllInMemoryRepositories> & {
  readonly app: Hono<AppEnv>
}

export const createTestApp = (options: TestAppOptions = {}): TestApp => {
  const repos = options.sharedRepositories ?? createAllInMemoryRepositories(options)
  const app = createApp({
    webOrigin: TEST_WEB_ORIGIN,
    logger: options.logger ?? silentLogger,
    sessionResolver: fixedSessionResolver(options.sessionUser ?? null),
    databasePing: () => Promise.resolve(options.databaseUp ?? true),
    repositories: repos,
    clock: () => TEST_NOW,
    ...(options.auth !== undefined ? { auth: options.auth } : {}),
  })
  return { app, ...repos }
}
