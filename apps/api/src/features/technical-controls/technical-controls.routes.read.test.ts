import type { TechnicalControl } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import { createTestApp } from '../../testing/test-app'

const mockControl: TechnicalControl = {
  id: '00000000-0000-4000-8000-000000000001',
  teamId: '00000000-0000-4000-8000-000000000010',
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
  it('permite consulta pública sin autenticación', async () => {
    const { app } = createTestApp({ sessionUser: null, technicalControls: [mockControl] })
    const res = await app.request('/technical-controls')
    expect(res.status).toBe(200)
    const body = (await res.json()) as Array<{ teamName: string; status: string }>
    expect(body).toHaveLength(1)
    expect(body[0]?.teamName).toBe('Ferrari')
    expect(body[0]?.status).toBe('passed')
  })

  it('aplica filtros de búsqueda correctamente', async () => {
    const { app } = createTestApp({ sessionUser: null, technicalControls: [mockControl] })
    const resMatch = await app.request('/technical-controls?season=2026&controlType=weight')
    expect(resMatch.status).toBe(200)
    const matchBody = (await resMatch.json()) as unknown[]
    expect(matchBody).toHaveLength(1)

    const resDiff = await app.request('/technical-controls?status=rejected')
    expect(resDiff.status).toBe(200)
    const diffBody = (await resDiff.json()) as unknown[]
    expect(diffBody).toHaveLength(0)

    const resTeam = await app.request(
      '/technical-controls?teamId=00000000-0000-4000-8000-000000000010',
    )
    expect(resTeam.status).toBe(200)
    const teamBody = (await resTeam.json()) as unknown[]
    expect(teamBody).toHaveLength(1)
  })

  it('oculta los controles cuya expiración ya pasó', async () => {
    const expired = {
      ...mockControl,
      id: '00000000-0000-4000-8000-000000000002',
      expiresAt: '2020-01-01T00:00:00.000Z',
    }
    const { app } = createTestApp({ sessionUser: null, technicalControls: [mockControl, expired] })
    const body = (await (await app.request('/technical-controls')).json()) as Array<{ id: string }>
    expect(body.map((c) => c.id)).toEqual([mockControl.id])
  })
})
