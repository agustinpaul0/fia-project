import { describe, expect, it } from 'vitest'
import type { SessionUser } from '../../core/auth/session'
import { createTestApp } from '../../testing/test-app'

const ADMIN_USER: SessionUser = {
  id: 'admin-1',
  role: 'fia_admin',
  teamId: null,
}

const STAFF_USER: SessionUser = {
  id: 'staff-1',
  role: 'team_staff',
  teamId: '00000000-0000-4000-8000-000000000010',
}

const validPayload = {
  teamId: '00000000-0000-4000-8000-000000000010',
  driverId: '00000000-0000-4000-8000-000000000020',
  carNumber: 16,
  controlType: 'weight',
  status: 'passed',
  notes: 'Pesaje reglamentario verificado.',
}

describe('rutas de escritura technical-controls', () => {
  it('exige autenticación y rol fia_admin', async () => {
    const unauthApp = createTestApp({ sessionUser: null })
    const resUnauth = await unauthApp.app.request('/technical-controls', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(validPayload),
    })
    expect(resUnauth.status).toBe(401)

    const staffApp = createTestApp({ sessionUser: STAFF_USER })
    const resForbidden = await staffApp.app.request('/technical-controls', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(validPayload),
    })
    expect(resForbidden.status).toBe(403)
  })

  it('permite a fia_admin registrar control válido y retorna 201', async () => {
    const { app } = createTestApp({ sessionUser: ADMIN_USER })
    const res = await app.request('/technical-controls', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(validPayload),
    })
    expect(res.status).toBe(201)
    const body = (await res.json()) as { status: string; controlType: string; carNumber: number }
    expect(body.status).toBe('passed')
    expect(body.controlType).toBe('weight')
    expect(body.carNumber).toBe(16)
  })

  it('rechaza con 400 si falta campo obligatorio o formato inválido', async () => {
    const { app } = createTestApp({ sessionUser: ADMIN_USER })
    const res = await app.request('/technical-controls', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...validPayload, controlType: 'invalid_type' }),
    })
    expect(res.status).toBe(400)
  })
})
