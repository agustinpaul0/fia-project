import { roleSchema } from '@fia/shared/contracts'
import type { Role } from '@fia/shared/domain'
import type { Context, MiddlewareHandler } from 'hono'
import type { BetterAuthInstance } from './better-auth'

export type SessionUser = {
  readonly id: string
  readonly role: Role
  readonly teamId: string | null
}

export type AppEnv = { Variables: { sessionUser: SessionUser | null } }

export type SessionResolver = (c: Context<AppEnv>) => Promise<SessionUser | null>

export const anonymousSessionResolver: SessionResolver = () => Promise.resolve(null)

export const createBetterAuthSessionResolver =
  (auth: BetterAuthInstance): SessionResolver =>
  async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    if (!session) {
      return null
    }
    const parsedRole = roleSchema.safeParse(session.user.role)
    const role: Role = parsedRole.success ? parsedRole.data : 'public'
    const rawTeamId = (session.user as Record<string, unknown>)['teamId']
    const teamId = typeof rawTeamId === 'string' ? rawTeamId : null
    return { id: session.user.id, role, teamId }
  }

export const resolveSession =
  (resolver: SessionResolver): MiddlewareHandler<AppEnv> =>
  async (c, next) => {
    c.set('sessionUser', await resolver(c))
    await next()
  }
