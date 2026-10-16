import {
  createPenaltyBodySchema,
  penaltiesQuerySchema,
  penaltyListSchema,
  penaltySchema,
} from '@fia/shared/contracts'
import { Hono } from 'hono'
import { publicAccess, requireRole } from '../../core/auth/access'
import type { AppEnv } from '../../core/auth/session'
import { created, ok } from '../../core/http/respond'
import { validate } from '../../core/http/validate'
import type { PenaltiesService } from './penalties.service'

const onlyFiaAdmin = requireRole('fia_admin')

export const createPenaltiesRoutes = (service: PenaltiesService): Hono<AppEnv> =>
  new Hono<AppEnv>()
    .get('/', publicAccess, validate('query', penaltiesQuerySchema), async (c) =>
      ok(c, penaltyListSchema, await service.list(c.req.valid('query'))),
    )
    .post('/', onlyFiaAdmin, validate('json', createPenaltyBodySchema), async (c) =>
      created(c, penaltySchema, await service.create(c.req.valid('json'))),
    )
