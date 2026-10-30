import type { Penalty } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import type { SessionUser } from '../../core/auth/session'
import { createTestApp } from '../../testing/test-app'

const TEAM_ID = '00000000-0000-4000-8000-000000000010'

const STAFF_USER: SessionUser = {
  id: 'staff-1',
  role: 'team_staff',
  teamId: TEAM_ID,
}

const mockPenalty: Penalty = {
  id: '00000000-0000-4000-8000-000000000001',
  teamId: TEAM_ID,
  teamName: 'Ferrari',
  categoryCode: 'F1',
  driverId: '00000000-0000-4000-8000-000000000020',
  driverName: 'Charles Leclerc',
  raceId: null,
  raceName: null,
  type: 'time_penalty',
  penalty: '5s recargo',
  reason: 'Infracción reiterada de límites de pista.',
  issuedAt: '2026-05-24T14:30:00.000Z',
  confirmedAt: null,
  confirmedByUserId: null,
  notificationStatus: 'pending',
  version: 1,
  createdAt: '2026-05-24T14:35:00.000Z',
}

describe('rutas de lectura penalties', () => {
  it('permite consulta pública sin autenticación pero oculta estado de notificación', async () => {
    const { app } = createTestApp({ sessionUser: null, penalties: [mockPenalty] })
    const res = await app.request('/penalties')
    expect(res.status).toBe(200)
    const body = (await res.json()) as Array<{
      teamName: string
      notificationStatus: string | null
    }>
    expect(body).toHaveLength(1)
    expect(body[0]?.teamName).toBe('Ferrari')
    expect(body[0]?.notificationStatus).toBeNull()
  })

  it('expone estado de notificación a la escudería involucrada', async () => {
    const { app } = createTestApp({ sessionUser: STAFF_USER, penalties: [mockPenalty] })
    const res = await app.request('/penalties')
    expect(res.status).toBe(200)
    const body = (await res.json()) as Array<{ notificationStatus: string | null }>
    expect(body[0]?.notificationStatus).toBe('pending')
  })

  it('aplica filtros de búsqueda correctamente', async () => {
    const { app } = createTestApp({ sessionUser: null, penalties: [mockPenalty] })
    const resMatch = await app.request('/penalties?season=2026&type=time_penalty')
    expect(resMatch.status).toBe(200)
    expect((await resMatch.json()) as unknown[]).toHaveLength(1)

    const resDiff = await app.request('/penalties?type=fine')
    expect(resDiff.status).toBe(200)
    expect((await resDiff.json()) as unknown[]).toHaveLength(0)
  })
})
