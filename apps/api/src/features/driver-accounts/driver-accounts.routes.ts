import {
  createDriverAccountBodySchema,
  driverAccountListSchema,
  driverAccountSchema,
  idParamsSchema,
  updateDriverAccountBodySchema,
  versionQuerySchema,
} from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import { Hono } from 'hono'
import { requireRole } from '../../core/auth/access'
import type { AppEnv } from '../../core/auth/session'
import { created, ok } from '../../core/http/respond'
import { validate } from '../../core/http/validate'
import type { DriverAccountsService } from './driver-accounts.service'

const onlyFiaAdmin = requireRole('fia_admin')
const vParam = validate('param', idParamsSchema)

export const createDriverAccountsRoutes = (service: DriverAccountsService): Hono<AppEnv> =>
  new Hono<AppEnv>()
    .get('/', onlyFiaAdmin, async (c) => ok(c, driverAccountListSchema, await service.list()))
    .post('/', onlyFiaAdmin, validate('json', createDriverAccountBodySchema), async (c) =>
      created(c, driverAccountSchema, await service.create(c.req.valid('json'))),
    )
    .put('/:id', onlyFiaAdmin, vParam, validate('json', updateDriverAccountBodySchema), async (c) =>
      ok(
        c,
        driverAccountSchema,
        await service.update(c.req.valid('param').id, c.req.valid('json')),
      ),
    )
    .delete('/:id', onlyFiaAdmin, vParam, validate('query', versionQuerySchema), async (c) => {
      const admin = c.get('sessionUser')
      if (!admin) {
        throw new AppError('UNAUTHENTICATED')
      }
      const command = {
        id: c.req.valid('param').id,
        version: c.req.valid('query').version,
        deactivatedBy: admin.id,
      }
      return ok(c, driverAccountSchema, await service.deactivate(command))
    })
