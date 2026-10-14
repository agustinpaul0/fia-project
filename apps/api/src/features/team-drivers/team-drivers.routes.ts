import { createTeamDriverBodySchema, driverListSchema, driverSchema } from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import { type Context, Hono } from 'hono'
import { requireRole } from '../../core/auth/access'
import type { AppEnv, SessionUser } from '../../core/auth/session'
import { created, ok } from '../../core/http/respond'
import { validate } from '../../core/http/validate'
import type { TeamDriversService } from './team-drivers.service'

const sessionUserOf = (c: Context<AppEnv>): SessionUser => {
  const user = c.get('sessionUser')
  if (user === null) {
    throw new AppError('UNAUTHENTICATED')
  }
  return user
}

const onlyTeamStaff = requireRole('team_staff')

export const createTeamDriversRoutes = (service: TeamDriversService): Hono<AppEnv> =>
  new Hono<AppEnv>()
    .get('/', onlyTeamStaff, async (c) =>
      ok(c, driverListSchema, await service.listMine(sessionUserOf(c))),
    )
    .post('/', onlyTeamStaff, validate('json', createTeamDriverBodySchema), async (c) =>
      created(c, driverSchema, await service.enroll(sessionUserOf(c), c.req.valid('json'))),
    )
