import type { Role } from '@fia/shared/domain'
import type { Context, MiddlewareHandler } from 'hono'

export type SessionUser = {
  readonly id: string
  readonly role: Role
  readonly teamId: string | null
}

export type AppEnv = { Variables: { sessionUser: SessionUser | null } }

export type SessionResolver = (c: Context<AppEnv>) => Promise<SessionUser | null>

export const anonymousSessionResolver: SessionResolver = () => Promise.resolve(null)

export const resolveSession =
  (resolver: SessionResolver): MiddlewareHandler<AppEnv> =>
  async (c, next) => {
    c.set('sessionUser', await resolver(c))
    await next()
  }
