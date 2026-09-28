import { teamOptionListSchema } from '@fia/shared/contracts'
import { Hono } from 'hono'
import { requireRole } from '../../core/auth/access'
import type { AppEnv } from '../../core/auth/session'
import type { TeamsService } from './teams.service'

export const createTeamsRoutes = (service: TeamsService): Hono<AppEnv> =>
  new Hono<AppEnv>().get('/', requireRole('fia_admin'), async (c) => {
    const options = await service.listOptions()
    return c.json(teamOptionListSchema.parse(options))
  })
