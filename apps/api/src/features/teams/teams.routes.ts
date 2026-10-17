import {
  driverOptionListSchema,
  idParamsSchema,
  teamOptionListSchema,
  teamRaceOptionListSchema,
  teamRacesQuerySchema,
} from '@fia/shared/contracts'
import { Hono } from 'hono'
import { requireRole } from '../../core/auth/access'
import type { AppEnv } from '../../core/auth/session'
import { ok } from '../../core/http/respond'
import { validate } from '../../core/http/validate'
import type { TeamsService } from './teams.service'

const onlyFiaAdmin = requireRole('fia_admin')

export const createTeamsRoutes = (service: TeamsService): Hono<AppEnv> =>
  new Hono<AppEnv>()
    .get('/', onlyFiaAdmin, async (c) => ok(c, teamOptionListSchema, await service.listOptions()))
    .get('/:id/drivers', onlyFiaAdmin, validate('param', idParamsSchema), async (c) =>
      ok(c, driverOptionListSchema, await service.listDriverOptions(c.req.valid('param').id)),
    )
    .get(
      '/:id/races',
      onlyFiaAdmin,
      validate('param', idParamsSchema),
      validate('query', teamRacesQuerySchema),
      async (c) => {
        const { id } = c.req.valid('param')
        const { season } = c.req.valid('query')
        return ok(c, teamRaceOptionListSchema, await service.listRaceOptions(id, season))
      },
    )
