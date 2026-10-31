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

const onlyStaff = requireRole('team_staff')
const vParam = validate('param', idParamsSchema)
const vCreateDriver = validate('json', createTeamDriverBodySchema)
const vUpdateDriver = validate('json', updateTeamDriverBodySchema)

export const createTeamDriversRoutes = (s: TeamDriversService): Hono<AppEnv> =>
  new Hono<AppEnv>()
    .get('/public', publicAccess, async (c) => ok(c, driverListSchema, await s.listPublic()))
    .get('/', onlyStaff, async (c) => ok(c, driverListSchema, await s.listMine(sessionUserOf(c))))
    .post('/', onlyStaff, vCreateDriver, async (c) =>
      created(c, driverSchema, await s.enroll(sessionUserOf(c), c.req.valid('json'))),
    )
    .put('/:id', onlyStaff, vParam, vUpdateDriver, async (c) =>
      ok(
        c,
        driverSchema,
        await s.update({
          user: sessionUserOf(c),
          id: c.req.valid('param').id,
          body: c.req.valid('json'),
        }),
      ),
    )
