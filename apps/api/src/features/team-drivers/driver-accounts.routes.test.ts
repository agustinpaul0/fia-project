import type { DriverRow } from '@fia/shared/db'
import { describe, expect, it } from 'vitest'
import type { SessionUser } from '../../core/auth/session'
import { createTestApp } from '../../testing/test-app'

const TEAM_ID = '00000000-0000-4000-8000-000000000010'
const DRIVER_ID = '00000000-0000-4000-8000-000000000020'

const ADMIN_USER: SessionUser = { id: 'admin-1', role: 'fia_admin', teamId: null }
const STAFF_USER: SessionUser = { id: 'staff-1', role: 'team_staff', teamId: TEAM_ID }

const seedDriver: DriverRow = {
  id: DRIVER_ID,
  firstName: 'Charles',
  lastName: 'Leclerc',
  code: 'LEC',
  number: 16,
  country: 'Mónaco',
  license: 'FIA-SL-016',
  teamId: TEAM_ID,
  categoryId: null,
  role: 'main',
  version: 1,
  createdAt: new Date('2026-01-15T10:00:00.000Z'),
  updatedAt: new Date('2026-01-15T10:00:00.000Z'),
}

const validPayload = {
  driverId: DRIVER_ID,
  email: 'leclerc@ferrari.it',
  password: 'Password123!',
  name: 'Charles Leclerc Oficial',
}

describe('rutas /team-drivers/accounts (US-27)', () => {
  it('exige rol fia_admin en creación y listado de cuentas de pilotos', async () => {
    const anonApp = createTestApp({ sessionUser: null, teamDrivers: [seedDriver] })
    expect((await anonApp.app.request('/team-drivers/accounts')).status).toBe(401)

    const staffApp = createTestApp({ sessionUser: STAFF_USER, teamDrivers: [seedDriver] })
    expect((await staffApp.app.request('/team-drivers/accounts')).status).toBe(403)
  })

  it('crea cuenta oficial para un piloto existente y rechaza duplicados', async () => {
    const { app } = createTestApp({ sessionUser: ADMIN_USER, teamDrivers: [seedDriver] })
    const res = await app.request('/team-drivers/accounts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(validPayload),
    })
    expect(res.status).toBe(201)
    const created = (await res.json()) as {
      id: string
      role: string
      isOfficial: boolean
      isActive: boolean
    }
    expect(created.role).toBe('driver')
    expect(created.isOfficial).toBe(true)
    expect(created.isActive).toBe(true)

    const dup = await app.request('/team-drivers/accounts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...validPayload, email: 'otro@ferrari.it' }),
    })
    expect(dup.status).toBe(409)
  })

  it('permite modificar y dar de baja lógica una cuenta de piloto', async () => {
    const { app } = createTestApp({ sessionUser: ADMIN_USER, teamDrivers: [seedDriver] })
    const createRes = await app.request('/team-drivers/accounts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(validPayload),
    })
    const created = (await createRes.json()) as { id: string }

    const updateRes = await app.request(`/team-drivers/accounts/${created.id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'C. Leclerc Scuderia', version: 1 }),
    })
    expect(updateRes.status).toBe(200)
    expect(((await updateRes.json()) as { name: string }).name).toBe('C. Leclerc Scuderia')

    const delRes = await app.request(`/team-drivers/accounts/${created.id}`, { method: 'DELETE' })
    expect(delRes.status).toBe(200)
    expect(((await delRes.json()) as { isActive: boolean }).isActive).toBe(false)
  })
})
