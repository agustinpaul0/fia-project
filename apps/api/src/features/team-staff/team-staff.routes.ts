import {
  createTeamStaffBodySchema,
  idParamsSchema,
  teamStaffListSchema,
  teamStaffSchema,
  updateTeamStaffBodySchema,
  versionQuerySchema,
} from '@fia/shared/contracts'
import { Hono } from 'hono'
import { requireRole } from '../../core/auth/access'
import type { AppEnv } from '../../core/auth/session'
import { created, noContent, ok } from '../../core/http/respond'
import { validate } from '../../core/http/validate'
import type { TeamStaffService } from './team-staff.service'

const onlyFiaAdmin = requireRole('fia_admin')

export const createTeamStaffRoutes = (service: TeamStaffService): Hono<AppEnv> =>
  new Hono<AppEnv>()
    .get('/', onlyFiaAdmin, async (c) => ok(c, teamStaffListSchema, await service.list()))
    .post('/', onlyFiaAdmin, validate('json', createTeamStaffBodySchema), async (c) =>
      created(c, teamStaffSchema, await service.create(c.req.valid('json'))),
    )
    .put(
      '/:id',
      onlyFiaAdmin,
      validate('param', idParamsSchema),
      validate('json', updateTeamStaffBodySchema),
      async (c) =>
        ok(c, teamStaffSchema, await service.update(c.req.valid('param').id, c.req.valid('json'))),
    )
    .delete(
      '/:id',
      onlyFiaAdmin,
      validate('param', idParamsSchema),
      validate('query', versionQuerySchema),
      async (c) => {
        const adminId = c.get('sessionUser')?.id ?? ''
        await service.deactivate(c.req.valid('param').id, c.req.valid('query').version, adminId)
        return noContent(c)
      },
    )
