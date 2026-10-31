import { penaltyListSchema } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import { aPenalty } from '../../testing/penalty-builders'
import { createTestApp } from '../../testing/test-app'

const MAY = aPenalty()
const JUNE_TEAM_ONLY = aPenalty({
  id: '00000000-0000-4000-8000-000000000002',
  driverId: null,
  driverName: null,
  issuedAt: '2026-06-10T12:00:00.000Z',
})
const { app } = createTestApp({ sessionUser: null, penalties: [MAY, JUNE_TEAM_ONLY] })

const idsFor = async (query: string): Promise<readonly string[]> => {
  const res = await app.request(`/penalties?${query}`)
  return penaltyListSchema.parse(await res.json()).map((p) => p.id)
}

describe('filtros de sanciones (US-3 y US-16)', () => {
  it('filtra por piloto', async () => {
    expect(await idsFor(`driverId=${MAY.driverId}`)).toEqual([MAY.id])
  })

  it('filtra por rango de fechas', async () => {
    const range = 'from=2026-06-01T00:00:00.000Z&to=2026-06-30T23:59:59.000Z'
    expect(await idsFor(range)).toEqual([JUNE_TEAM_ONLY.id])
  })

  it('ordena por fecha ascendente o, por defecto, la más reciente primero', async () => {
    expect(await idsFor('sort=date_asc')).toEqual([MAY.id, JUNE_TEAM_ONLY.id])
    expect(await idsFor('')).toEqual([JUNE_TEAM_ONLY.id, MAY.id])
  })

  it('rechaza un rango invertido con un mensaje claro', async () => {
    const res = await app.request(
      '/penalties?from=2026-06-30T00:00:00.000Z&to=2026-06-01T00:00:00.000Z',
    )
    expect(res.status).toBe(400)
    const body = (await res.json()) as { error: { fields: Record<string, string[]> } }
    expect(body.error.fields['to']).toEqual([
      'La fecha de inicio no puede ser posterior a la fecha de fin.',
    ])
  })
})
