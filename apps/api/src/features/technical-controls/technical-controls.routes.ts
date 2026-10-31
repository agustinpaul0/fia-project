import {
  createTechnicalControlBodySchema,
  technicalControlListSchema,
  technicalControlSchema,
  technicalControlsQuerySchema,
} from '@fia/shared/contracts'
import { Hono } from 'hono'
import { publicAccess, requireRole } from '../../core/auth/access'
import type { AppEnv } from '../../core/auth/session'
import { created, ok } from '../../core/http/respond'
import { validate } from '../../core/http/validate'
import type { TechnicalControlsService } from './technical-controls.service'

const onlyFiaAdmin = requireRole('fia_admin')
const onlyTeamStaff = requireRole('team_staff')

export const createTechnicalControlsRoutes = (service: TechnicalControlsService): Hono<AppEnv> =>
  new Hono<AppEnv>()
    .get('/', publicAccess, validate('query', technicalControlsQuerySchema), async (c) =>
      ok(
        c,
        technicalControlListSchema,
        await service.list(c.req.valid('query'), c.get('sessionUser')),
      ),
    )
    .get('/mine', onlyTeamStaff, validate('query', technicalControlsQuerySchema), async (c) =>
      ok(
        c,
        technicalControlListSchema,
        await service.listByTeam(c.get('sessionUser')?.teamId ?? null, c.req.valid('query')),
      ),
    )
    .post('/', onlyFiaAdmin, validate('json', createTechnicalControlBodySchema), async (c) =>
      created(c, technicalControlSchema, await service.create(c.req.valid('json'))),
    )
