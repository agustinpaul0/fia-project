import type { DriverRow } from '@fia/shared/db'
import { describe, expect, it } from 'vitest'
import type { SessionUser } from '../../core/auth/session'
import { createTestApp } from '../../testing/test-app'

const STAFF_FERRARI: SessionUser = {
  id: 'user-ferrari',
  role: 'team_staff',
  teamId: '00000000-0000-4000-8000-000000000010',
}

const ADMIN_USER: SessionUser = {
  id: 'admin-1',
  role: 'fia_admin',
  teamId: null,
}

const mockRow: DriverRow = {
  id: '00000000-0000-4000-8000-000000000001',
  firstName: 'Charles',
  lastName: 'Leclerc',
  code: 'LEC',
  number: 16,
  country: 'Mónaco',
  license: 'FIA-16-LEC',
  teamId: '00000000-0000-4000-8000-000000000010',
  role: 'main',
  version: 1,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
}

describe('rutas de lectura team-drivers', () => {
  it('exige sesión y rol team_staff', async () => {
    const unauthApp = createTestApp({ sessionUser: null })
    const resUnauth = await unauthApp.app.request('/team-drivers')
    expect(resUnauth.status).toBe(401)

    const adminApp = createTestApp({ sessionUser: ADMIN_USER })
    const resForbidden = await adminApp.app.request('/team-drivers')
    expect(resForbidden.status).toBe(403)
  })

  it('lista pilotos de la escudería autenticada con 200', async () => {
    const { app } = createTestApp({
      sessionUser: STAFF_FERRARI,
      teamDrivers: [mockRow],
    })
    const res = await app.request('/team-drivers')
    expect(res.status).toBe(200)
    const body = (await res.json()) as Array<{ code: string }>
    expect(body).toHaveLength(1)
    expect(body[0]?.code).toBe('LEC')
  })
})
