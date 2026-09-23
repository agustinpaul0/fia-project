import { healthResponseSchema } from '@fia/shared/contracts'
import { Hono } from 'hono'
import { publicAccess } from '../../core/auth/access'
import type { AppEnv } from '../../core/auth/session'
import type { DatabasePing } from '../../core/db/ping'
import { ok } from '../../core/http/respond'

export const createHealthRoutes = (ping: DatabasePing): Hono<AppEnv> =>
  new Hono<AppEnv>().get('/', publicAccess, async (c) =>
    ok(c, healthResponseSchema, { status: 'ok', database: (await ping()) ? 'up' : 'down' }),
  )
