import type { CategoryRow } from '@fia/shared/db'
import type { Hono } from 'hono'
import { createApp } from '../app/create-app'
import type { AppEnv, SessionUser } from '../core/auth/session'
import { type Logger, silentLogger } from '../core/logger'
import {
  createInMemoryCategoriesRepository,
  type InMemoryCategoriesRepository,
} from './in-memory-categories.repository'
import { fixedSessionResolver } from './session-users'

export const TEST_WEB_ORIGIN = 'http://localhost:5173'

export type TestAppOptions = {
  readonly sessionUser?: SessionUser | null
  readonly categories?: readonly CategoryRow[]
  readonly databaseUp?: boolean
  readonly logger?: Logger
}

export type TestApp = {
  readonly app: Hono<AppEnv>
  readonly categories: InMemoryCategoriesRepository
}

export const createTestApp = (options: TestAppOptions = {}): TestApp => {
  const categories = createInMemoryCategoriesRepository(options.categories ?? [])
  const app = createApp({
    webOrigin: TEST_WEB_ORIGIN,
    logger: options.logger ?? silentLogger,
    sessionResolver: fixedSessionResolver(options.sessionUser ?? null),
    databasePing: () => Promise.resolve(options.databaseUp ?? true),
    repositories: { categories },
  })
  return { app, categories }
}
