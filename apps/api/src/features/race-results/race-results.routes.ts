import {
  eligibleDriverListSchema,
  idParamsSchema,
  raceClassificationBodySchema,
  raceClassificationSchema,
  raceListQuerySchema,
  raceSummaryListSchema,
} from '@fia/shared/contracts'
import { Hono } from 'hono'
import { publicAccess, requireRole } from '../../core/auth/access'
import type { AppEnv } from '../../core/auth/session'
import { ok } from '../../core/http/respond'
import { validate } from '../../core/http/validate'
import type { RaceResultsService } from './race-results.service'

export const createRaceResultsRoutes = (service: RaceResultsService): Hono<AppEnv> =>
  new Hono<AppEnv>()
    .get('/', publicAccess, validate('query', raceListQuerySchema), async (c) =>
      ok(c, raceSummaryListSchema, await service.listSeason(c.req.valid('query').season)),
    )
    .get('/:id/classification', publicAccess, validate('param', idParamsSchema), async (c) =>
      ok(c, raceClassificationSchema, await service.getClassification(c.req.valid('param').id)),
    )
    .get('/:id/drivers', requireRole('fia_admin'), validate('param', idParamsSchema), async (c) =>
      ok(c, eligibleDriverListSchema, await service.listEligibleDrivers(c.req.valid('param').id)),
    )
    .put(
      '/:id/classification',
      requireRole('fia_admin'),
      validate('param', idParamsSchema),
      validate('json', raceClassificationBodySchema),
      async (c) => {
        const { id } = c.req.valid('param')
        const saved = await service.saveClassification(id, c.req.valid('json'))
        return ok(c, raceClassificationSchema, saved)
      },
    )
