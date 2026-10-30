import {
  createTeamDriverBodySchema,
  driverListSchema,
  driverSchema,
  idParamsSchema,
  updateTeamDriverBodySchema,
} from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import { type Context, Hono } from 'hono'
import { publicAccess, requireRole } from '../../core/auth/access'
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
    .get('/public', publicAccess, async (c) => ok(c, driverListSchema, await service.listPublic()))
    .get('/', onlyTeamStaff, async (c) =>
      ok(c, driverListSchema, await service.listMine(sessionUserOf(c))),
    )
    .post('/', onlyTeamStaff, validate('json', createTeamDriverBodySchema), async (c) =>
      created(c, driverSchema, await service.enroll(sessionUserOf(c), c.req.valid('json'))),
    )
    .put(
      '/:id',
      onlyTeamStaff,
      validate('param', idParamsSchema),
      validate('json', updateTeamDriverBodySchema),
      async (c) =>
        ok(
          c,
          driverSchema,
          await service.update({
            user: sessionUserOf(c),
            id: c.req.valid('param').id,
            body: c.req.valid('json'),
          }),
        ),
    )
