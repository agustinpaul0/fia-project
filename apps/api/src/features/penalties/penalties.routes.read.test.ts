import type { Penalty } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import { createTestApp } from '../../testing/test-app'

const mockPenalty: Penalty = {
  id: '00000000-0000-4000-8000-000000000001',
  teamId: '00000000-0000-4000-8000-000000000010',
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
  version: 1,
  createdAt: '2026-05-24T14:35:00.000Z',
}

describe('rutas de lectura penalties', () => {
  it('permite consulta pública sin autenticación', async () => {
    const { app } = createTestApp({ sessionUser: null, penalties: [mockPenalty] })
    const res = await app.request('/penalties')
    expect(res.status).toBe(200)
    const body = (await res.json()) as Array<{ teamName: string }>
    expect(body).toHaveLength(1)
    expect(body[0]?.teamName).toBe('Ferrari')
  })

  it('aplica filtros de búsqueda correctamente', async () => {
    const { app } = createTestApp({ sessionUser: null, penalties: [mockPenalty] })
    const resMatch = await app.request('/penalties?season=2026&type=time_penalty')
    expect(resMatch.status).toBe(200)
    const matchBody = (await resMatch.json()) as unknown[]
    expect(matchBody).toHaveLength(1)

    const resDiff = await app.request('/penalties?type=fine')
    expect(resDiff.status).toBe(200)
    const diffBody = (await resDiff.json()) as unknown[]
    expect(diffBody).toHaveLength(0)
  })
})
