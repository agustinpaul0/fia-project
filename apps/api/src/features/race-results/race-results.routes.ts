import {
  cancelRaceBodySchema,
  driverStandingListSchema,
  eligibleDriverListSchema,
  idParamsSchema,
  raceClassificationBodySchema,
  raceClassificationSchema,
  raceListQuerySchema,
  raceSummaryListSchema,
  raceSummarySchema,
  updateRaceBodySchema,
} from '@fia/shared/contracts'
import { type Context, Hono } from 'hono'
import { publicAccess, requireRole } from '../../core/auth/access'
import type { AppEnv } from '../../core/auth/session'
import { ok } from '../../core/http/respond'
import { validate } from '../../core/http/validate'
import type { RaceResultsService } from './race-results.service'

const onlyFiaAdmin = requireRole('fia_admin')
const vParam = validate('param', idParamsSchema)
const vQuery = validate('query', raceListQuerySchema)
const vClass = validate('json', raceClassificationBodySchema)
const vUpdate = validate('json', updateRaceBodySchema)
const vCancel = validate('json', cancelRaceBodySchema)

const userIdOf = (c: Context<AppEnv>): string => c.get('sessionUser')?.id ?? 'system'

export const createRaceResultsRoutes = (service: RaceResultsService): Hono<AppEnv> =>
  new Hono<AppEnv>()
    .get('/', publicAccess, vQuery, async (c) =>
      ok(c, raceSummaryListSchema, await service.listSeason(c.req.valid('query'))),
    )
    .get('/standings', publicAccess, vQuery, async (c) =>
      ok(c, driverStandingListSchema, await service.seasonStandings(c.req.valid('query'))),
    )
    .get('/:id/classification', publicAccess, vParam, async (c) =>
      ok(c, raceClassificationSchema, await service.getClassification(c.req.valid('param').id)),
    )
    .get('/:id/drivers', onlyFiaAdmin, vParam, async (c) =>
      ok(c, eligibleDriverListSchema, await service.listEligibleDrivers(c.req.valid('param').id)),
    )
    .put('/:id/classification', onlyFiaAdmin, vParam, vClass, async (c) =>
      ok(
        c,
        raceClassificationSchema,
        await service.saveClassification(c.req.valid('param').id, c.req.valid('json')),
      ),
    )
    .put('/:id', onlyFiaAdmin, vParam, vUpdate, async (c) =>
      ok(
        c,
        raceSummarySchema,
        await service.updateRace(c.req.valid('param').id, c.req.valid('json'), userIdOf(c)),
      ),
    )
    .delete('/:id', onlyFiaAdmin, vParam, vCancel, async (c) =>
      ok(
        c,
        raceSummarySchema,
        await service.cancelRace(c.req.valid('param').id, c.req.valid('json').version, userIdOf(c)),
      ),
    )
