import {
  createPenaltyBodySchema,
  idParamsSchema,
  penaltiesQuerySchema,
  penaltyListSchema,
  penaltySchema,
} from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import { Hono } from 'hono'
import { publicAccess, requireRole } from '../../core/auth/access'
import type { AppEnv } from '../../core/auth/session'
import { created, ok } from '../../core/http/respond'
import { validate } from '../../core/http/validate'
import type { PenaltiesService } from './penalties.service'

const onlyFiaAdmin = requireRole('fia_admin')
const onlyTeamStaff = requireRole('team_staff')

export const createPenaltiesRoutes = (service: PenaltiesService): Hono<AppEnv> =>
  new Hono<AppEnv>()
    .get('/', publicAccess, validate('query', penaltiesQuerySchema), async (c) =>
      ok(c, penaltyListSchema, await service.list(c.req.valid('query'), c.get('sessionUser'))),
    )
    .post('/', onlyFiaAdmin, validate('json', createPenaltyBodySchema), async (c) =>
      created(c, penaltySchema, await service.create(c.req.valid('json'))),
    )
    .post('/:id/confirm', onlyTeamStaff, validate('param', idParamsSchema), async (c) => {
      const user = c.get('sessionUser')
      if (!user) {
        throw new AppError('UNAUTHENTICATED')
      }
      return ok(c, penaltySchema, await service.confirm(c.req.valid('param').id, user))
    })
