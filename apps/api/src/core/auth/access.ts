import { AppError, type Role } from '@fia/shared/domain'
import type { MiddlewareHandler } from 'hono'
import type { AppEnv } from './session'

const accessPolicies = new WeakSet<MiddlewareHandler<AppEnv>>()

const registerPolicy = (policy: MiddlewareHandler<AppEnv>): MiddlewareHandler<AppEnv> => {
  accessPolicies.add(policy)
  return policy
}

export const isAccessPolicy = (handler: unknown): boolean =>
  typeof handler === 'function' && accessPolicies.has(handler as MiddlewareHandler<AppEnv>)

export const publicAccess: MiddlewareHandler<AppEnv> = registerPolicy(async (_c, next) => {
  await next()
})

export const requireRole = (...roles: readonly Role[]): MiddlewareHandler<AppEnv> =>
  registerPolicy(async (c, next) => {
    const user = c.get('sessionUser')
    if (user === null) {
      throw new AppError('UNAUTHENTICATED')
    }
    if (!roles.includes(user.role)) {
      throw new AppError('FORBIDDEN')
    }
    await next()
  })
