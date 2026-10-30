import type { DriverRow } from '@fia/shared/db'
import { describe, expect, it } from 'vitest'
import type { SessionUser } from '../../core/auth/session'
import { createTestApp } from '../../testing/test-app'

const STAFF_FERRARI: SessionUser = {
  id: 'user-ferrari',
  role: 'team_staff',
  teamId: '00000000-0000-4000-8000-000000000010',
}

const mockRow: DriverRow = {
  id: '00000000-0000-4000-8000-000000000001',
  firstName: 'Charles',
  lastName: 'Leclerc',
  code: 'LEC',
  number: 16,
  country: 'Mónaco',
  license: 'FIA-16-LEC',
  categoryId: null,
  teamId: '00000000-0000-4000-8000-000000000010',
  role: 'main',
  version: 1,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
}

const validPayload = {
  firstName: 'Carlos',
  lastName: 'Sainz',
  code: 'SAI',
  number: 55,
  country: 'España',
  license: 'FIA-55-SAI',
  role: 'main' as const,
}

describe('rutas de escritura team-drivers', () => {
  it('inscribe piloto correctamente y retorna 201', async () => {
    const { app } = createTestApp({ sessionUser: STAFF_FERRARI })
    const res = await app.request('/team-drivers', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(validPayload),
    })
    expect(res.status).toBe(201)
    const body = (await res.json()) as { code: string; number: number }
    expect(body.code).toBe('SAI')
    expect(body.number).toBe(55)
  })

  it('rechaza con 400 si faltan datos o formato inválido', async () => {
    const { app } = createTestApp({ sessionUser: STAFF_FERRARI })
    const res = await app.request('/team-drivers', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...validPayload, code: 'invalido' }),
    })
    expect(res.status).toBe(400)
  })

  it('rechaza con 409 si el número de coche ya existe', async () => {
    const { app } = createTestApp({ sessionUser: STAFF_FERRARI, teamDrivers: [mockRow] })
    const res = await app.request('/team-drivers', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...validPayload, number: 16 }),
    })
    expect(res.status).toBe(409)
  })

  it('ignora intentos de inscribir en otra escudería: rechaza teamId en el cuerpo', async () => {
    const { app } = createTestApp({ sessionUser: STAFF_FERRARI })
    const res = await app.request('/team-drivers', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...validPayload, teamId: '00000000-0000-4000-8000-000000000099' }),
    })
    expect(res.status).toBe(400)
  })

  it('modifica datos y condición de un piloto propio con PUT /team-drivers/:id', async () => {
    const { app } = createTestApp({ sessionUser: STAFF_FERRARI, teamDrivers: [mockRow] })
    const res = await app.request(`/team-drivers/${mockRow.id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ...validPayload,
        code: 'LEC',
        number: 16,
        role: 'reserve',
        version: 1,
      }),
    })
    expect(res.status).toBe(200)
    const body = (await res.json()) as { role: string; version: number }
    expect(body.role).toBe('reserve')
    expect(body.version).toBe(2)
  })
})
