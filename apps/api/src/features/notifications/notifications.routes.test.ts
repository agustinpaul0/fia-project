import {
  errorResponseSchema,
  scoreNotificationListSchema,
  scoreNotificationSchema,
} from '@fia/shared/contracts'
import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { readError, sendJson } from '../../testing/http'
import { aNotification, STAFF_A, STAFF_B } from '../../testing/notification-builders'
import { FIA_ADMIN } from '../../testing/session-users'
import { createTestApp } from '../../testing/test-app'

const PENDING = aNotification()
const CONFIRM = { method: 'POST', path: `/notifications/${PENDING.id}/confirm` } as const

describe('Rutas de notificaciones', () => {
  it('el personal de escudería lista sus pendientes según el contrato', async () => {
    const { app } = createTestApp({ sessionUser: STAFF_A, notifications: [PENDING] })
    const response = await app.request('/notifications')
    expect(scoreNotificationListSchema.parse(await response.json())).toHaveLength(1)
  })

  it('exige sesión y rol de escudería para listar y confirmar', async () => {
    const anonymous = createTestApp({ notifications: [PENDING] }).app
    const admin = createTestApp({ sessionUser: FIA_ADMIN, notifications: [PENDING] }).app
    expect((await anonymous.request('/notifications')).status).toBe(401)
    expect((await sendJson(admin, CONFIRM)).status).toBe(403)
  })

  it('confirma con un POST y el segundo intento avisa que ya no hace falta', async () => {
    const { app } = createTestApp({ sessionUser: STAFF_A, notifications: [PENDING] })
    const first = await sendJson(app, CONFIRM)
    expect(scoreNotificationSchema.parse(await first.json()).status).toBe('confirmed')
    const second = await sendJson(app, CONFIRM)
    expect(second.status).toBe(409)
    expect((await readError(second)).code).toBe('NOTIFICATION_ALREADY_CONFIRMED')
  })

  it('no revela notificaciones de otra escudería', async () => {
    const { app } = createTestApp({ sessionUser: STAFF_B, notifications: [PENDING] })
    const response = await sendJson(app, CONFIRM)
    expect(response.status).toBe(404)
    expect((await readError(response)).code).toBe('NOTIFICATION_NOT_FOUND')
  })

  it('la FIA consulta la auditoría y el personal de escudería no', async () => {
    const admin = createTestApp({ sessionUser: FIA_ADMIN, notifications: [PENDING] }).app
    const staff = createTestApp({ sessionUser: STAFF_A, notifications: [PENDING] }).app
    expect(
      scoreNotificationListSchema.parse(await (await admin.request('/notifications/audit')).json()),
    ).toHaveLength(1)
    expect((await staff.request('/notifications/audit')).status).toBe(403)
  })

  it('ids arbitrarios al confirmar nunca producen 5xx', async () => {
    const { app } = createTestApp({ sessionUser: STAFF_A, notifications: [PENDING] })
    await fc.assert(
      fc.asyncProperty(fc.string(), async (id) => {
        const path = `/notifications/${encodeURIComponent(id)}/confirm`
        const response = await sendJson(app, { method: 'POST', path })
        expect(response.status).toBeLessThan(500)
        expect(errorResponseSchema.safeParse(await response.json()).success).toBe(true)
      }),
    )
  })
})
