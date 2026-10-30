import {
  createDriverAccountBodySchema,
  createTeamDriverBodySchema,
  driverAccountListSchema,
  driverAccountSchema,
  driverListSchema,
  driverSchema,
  idParamsSchema,
  updateDriverAccountBodySchema,
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
const onlyAdmin = requireRole('fia_admin')
const vParam = validate('param', idParamsSchema)
const vCreateDriver = validate('json', createTeamDriverBodySchema)
const vUpdateDriver = validate('json', updateTeamDriverBodySchema)
const vCreateAcc = validate('json', createDriverAccountBodySchema)
const vUpdateAcc = validate('json', updateDriverAccountBodySchema)

export const createTeamDriversRoutes = (s: TeamDriversService): Hono<AppEnv> =>
  new Hono<AppEnv>()
    .get('/public', publicAccess, async (c) => ok(c, driverListSchema, await s.listPublic()))
    .get('/accounts', onlyAdmin, async (c) =>
      ok(c, driverAccountListSchema, await s.listAccounts()),
    )
    .post('/accounts', onlyAdmin, vCreateAcc, async (c) =>
      created(c, driverAccountSchema, await s.createAccount(c.req.valid('json'))),
    )
    .put('/accounts/:id', onlyAdmin, vParam, vUpdateAcc, async (c) =>
      ok(
        c,
        driverAccountSchema,
        await s.updateAccount(c.req.valid('param').id, c.req.valid('json')),
      ),
    )
    .delete('/accounts/:id', onlyAdmin, vParam, async (c) =>
      ok(c, driverAccountSchema, await s.deactivateAccount(c.req.valid('param').id)),
    )
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
