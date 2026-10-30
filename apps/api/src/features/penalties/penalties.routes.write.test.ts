import type { Penalty } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import type { SessionUser } from '../../core/auth/session'
import { createTestApp } from '../../testing/test-app'

const TEAM_ID = '00000000-0000-4000-8000-000000000010'

const ADMIN_USER: SessionUser = { id: 'admin-1', role: 'fia_admin', teamId: null }
const STAFF_USER: SessionUser = { id: 'staff-1', role: 'team_staff', teamId: TEAM_ID }

const validPayload = {
  teamId: TEAM_ID,
  driverId: '00000000-0000-4000-8000-000000000020',
  type: 'time_penalty',
  penalty: '5s recargo',
  reason: 'Infracción de límites de pista.',
}

const seedPenalty: Penalty = {
  id: '00000000-0000-4000-8000-000000000001',
  teamId: TEAM_ID,
  teamName: 'Ferrari',
  categoryCode: 'F1',
  driverId: null,
  driverName: null,
  raceId: null,
  raceName: null,
  type: 'time_penalty',
  penalty: '5s recargo',
  reason: 'Infracción de límites de pista.',
  issuedAt: '2026-05-24T14:30:00.000Z',
  confirmedAt: null,
  confirmedByUserId: null,
  notificationStatus: 'pending',
  version: 1,
  createdAt: '2026-05-24T14:35:00.000Z',
}

describe('rutas de escritura penalties', () => {
  it('exige autenticación y rol fia_admin para crear', async () => {
    const unauthApp = createTestApp({ sessionUser: null })
    const resUnauth = await unauthApp.app.request('/penalties', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(validPayload),
    })
    expect(resUnauth.status).toBe(401)

    const staffApp = createTestApp({ sessionUser: STAFF_USER })
    const resForbidden = await staffApp.app.request('/penalties', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(validPayload),
    })
    expect(resForbidden.status).toBe(403)
  })

  it('permite a fia_admin registrar sanción válida y rechaza motivos inválidos', async () => {
    const { app } = createTestApp({ sessionUser: ADMIN_USER })
    const res = await app.request('/penalties', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(validPayload),
    })
    expect(res.status).toBe(201)

    const badRes = await app.request('/penalties', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...validPayload, reason: 'No' }),
    })
    expect(badRes.status).toBe(400)
  })

  it('permite a team_staff confirmar su sanción una sola vez en POST /penalties/:id/confirm', async () => {
    const { app } = createTestApp({ sessionUser: STAFF_USER, penalties: [seedPenalty] })
    const res1 = await app.request(`/penalties/${seedPenalty.id}/confirm`, { method: 'POST' })
    expect(res1.status).toBe(200)
    const body = (await res1.json()) as { notificationStatus: string }
    expect(body.notificationStatus).toBe('confirmed')

    const res2 = await app.request(`/penalties/${seedPenalty.id}/confirm`, { method: 'POST' })
    expect(res2.status).toBe(409)
  })
})
