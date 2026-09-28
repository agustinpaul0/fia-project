import {
  idParamsSchema,
  scoreNotificationListSchema,
  scoreNotificationSchema,
} from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import { type Context, Hono } from 'hono'
import { requireRole } from '../../core/auth/access'
import type { AppEnv, SessionUser } from '../../core/auth/session'
import { ok } from '../../core/http/respond'
import { validate } from '../../core/http/validate'
import type { NotificationsService } from './notifications.service'

const sessionUserOf = (c: Context<AppEnv>): SessionUser => {
  const user = c.get('sessionUser')
  if (user === null) {
    throw new AppError('UNAUTHENTICATED')
  }
  return user
}

const onlyTeamStaff = requireRole('team_staff')

export const createNotificationsRoutes = (service: NotificationsService): Hono<AppEnv> =>
  new Hono<AppEnv>()
    .get('/', onlyTeamStaff, async (c) =>
      ok(c, scoreNotificationListSchema, await service.listMine(sessionUserOf(c))),
    )
    .get('/audit', requireRole('fia_admin'), async (c) =>
      ok(c, scoreNotificationListSchema, await service.audit()),
    )
    .post('/:id/confirm', onlyTeamStaff, validate('param', idParamsSchema), async (c) => {
      const confirmed = await service.confirm(sessionUserOf(c), c.req.valid('param').id)
      return ok(c, scoreNotificationSchema, confirmed)
    })
