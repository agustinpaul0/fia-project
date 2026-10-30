import type { TechnicalControl } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import type { SessionUser } from '../../core/auth/session'
import { createTestApp } from '../../testing/test-app'

const TEAM_ID = '00000000-0000-4000-8000-000000000010'

const teamStaffUser: SessionUser = {
  id: '00000000-0000-4000-8000-000000000090',
  role: 'team_staff',
  teamId: TEAM_ID,
}

const mockControl: TechnicalControl = {
  id: '00000000-0000-4000-8000-000000000001',
  teamId: TEAM_ID,
  teamName: 'Ferrari',
  driverId: '00000000-0000-4000-8000-000000000020',
  driverName: 'Charles Leclerc',
  carNumber: 16,
  raceId: null,
  raceName: null,
  controlType: 'weight',
  status: 'passed',
  notes: 'Pesaje conforme a reglamento.',
  inspectedAt: '2026-05-24T14:30:00.000Z',
  expiresAt: '2099-05-24T20:00:00.000Z',
  version: 1,
  createdAt: '2026-05-24T14:35:00.000Z',
}

describe('rutas de lectura technical-controls', () => {
  it('permite consulta pública sin autenticación pero censura las observaciones', async () => {
    const { app } = createTestApp({ sessionUser: null, technicalControls: [mockControl] })
    const res = await app.request('/technical-controls')
    expect(res.status).toBe(200)
    const body = (await res.json()) as Array<{
      teamName: string
      status: string
      notes: string | null
    }>
    expect(body).toHaveLength(1)
    expect(body[0]?.teamName).toBe('Ferrari')
    expect(body[0]?.status).toBe('passed')
    expect(body[0]?.notes).toBeNull()
  })

  it('expone observaciones completas a la escudería dueña en /technical-controls/mine', async () => {
    const otherControl = {
      ...mockControl,
      id: '00000000-0000-4000-8000-000000000003',
      teamId: '00000000-0000-4000-8000-000000000099',
    }
    const { app } = createTestApp({
      sessionUser: teamStaffUser,
      technicalControls: [mockControl, otherControl],
    })
    const res = await app.request('/technical-controls/mine')
    expect(res.status).toBe(200)
    const body = (await res.json()) as Array<{ id: string; notes: string | null }>
    expect(body).toHaveLength(1)
    expect(body[0]?.id).toBe(mockControl.id)
    expect(body[0]?.notes).toBe('Pesaje conforme a reglamento.')
  })

  it('aplica filtros de búsqueda y oculta controles cuya expiración ya pasó', async () => {
    const expired = {
      ...mockControl,
      id: '00000000-0000-4000-8000-000000000002',
      expiresAt: '2020-01-01T00:00:00.000Z',
    }
    const { app } = createTestApp({ sessionUser: null, technicalControls: [mockControl, expired] })
    const resMatch = await app.request('/technical-controls?season=2026&controlType=weight')
    expect(resMatch.status).toBe(200)
    expect((await resMatch.json()) as unknown[]).toHaveLength(1)

    const resDiff = await app.request('/technical-controls?status=rejected')
    expect((await resDiff.json()) as unknown[]).toHaveLength(0)
  })
})
