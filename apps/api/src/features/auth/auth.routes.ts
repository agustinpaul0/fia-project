import { Hono } from 'hono'
import { publicAccess } from '../../core/auth/access'
import type { BetterAuthInstance } from '../../core/auth/better-auth'
import { translateAuthResponse } from '../../core/auth/better-auth-error'
import type { AppEnv } from '../../core/auth/session'

export type AuthHandler = (req: Request) => Promise<Response>

export const createAuthRoutes = (auth: BetterAuthInstance | AuthHandler): Hono<AppEnv> => {
  const handler: AuthHandler = typeof auth === 'function' ? auth : (req) => auth.handler(req)
  const dispatch = async (req: Request): Promise<Response> => {
    const response = await handler(req)
    return translateAuthResponse(response)
  }

  return new Hono<AppEnv>()
    .post('/sign-in/email', publicAccess, async (c) => dispatch(c.req.raw))
    .post('/sign-out', publicAccess, async (c) => dispatch(c.req.raw))
    .get('/session', publicAccess, async (c) => dispatch(c.req.raw))
    .get('/get-session', publicAccess, async (c) => dispatch(c.req.raw))
    .get('/ok', publicAccess, async (c) => dispatch(c.req.raw))
}
