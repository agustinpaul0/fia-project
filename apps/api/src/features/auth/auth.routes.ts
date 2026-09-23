import { Hono } from 'hono'
import { publicAccess } from '../../core/auth/access'
import type { BetterAuthInstance } from '../../core/auth/better-auth'
import type { AppEnv } from '../../core/auth/session'

export type AuthHandler = (req: Request) => Promise<Response>

export const createAuthRoutes = (auth: BetterAuthInstance | AuthHandler): Hono<AppEnv> => {
  const handler: AuthHandler = typeof auth === 'function' ? auth : (req) => auth.handler(req)
  return new Hono<AppEnv>()
    .get('/*', publicAccess, async (c) => handler(c.req.raw))
    .post('/*', publicAccess, async (c) => handler(c.req.raw))
}
