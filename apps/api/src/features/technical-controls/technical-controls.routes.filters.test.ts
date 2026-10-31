import { technicalControlListSchema } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import { aTechnicalControl } from '../../testing/technical-control-builders'
import { createTestApp } from '../../testing/test-app'

const ACTIVE = { expiresAt: '2099-01-01T00:00:00.000Z' }
const FUEL = aTechnicalControl({
  ...ACTIVE,
  driverId: '00000000-0000-4000-8000-000000000020',
  driverName: 'Lando Norris',
})
const LATER = aTechnicalControl({
  ...ACTIVE,
  id: '00000000-0000-4000-8000-000000000002',
  controlType: 'weight',
  driverId: null,
  driverName: null,
  inspectedAt: '2026-08-01T12:00:00.000Z',
})
const { app } = createTestApp({ sessionUser: null, technicalControls: [FUEL, LATER] })

const idsFor = async (query: string): Promise<readonly string[]> => {
  const res = await app.request(`/technical-controls?${query}`)
  return technicalControlListSchema.parse(await res.json()).map((c) => c.id)
}

describe('filtros de controles técnicos (US-3)', () => {
  it('combina rango de fechas, tipo de control e identificador de piloto', async () => {
    expect(await idsFor('from=2026-07-01T00:00:00.000Z')).toEqual([LATER.id])
    expect(await idsFor('controlType=weight')).toEqual([LATER.id])
    expect(await idsFor(`driverId=${FUEL.driverId}`)).toEqual([FUEL.id])
    expect(await idsFor(`driverId=${FUEL.driverId}&controlType=weight`)).toEqual([])
  })

  it('ordena por relevancia (lo más reciente primero) o por fecha ascendente', async () => {
    expect(await idsFor('sort=relevance')).toEqual([LATER.id, FUEL.id])
    expect(await idsFor('sort=date_asc')).toEqual([FUEL.id, LATER.id])
  })

  it('rechaza un rango invertido', async () => {
    const res = await app.request(
      '/technical-controls?from=2026-08-01T00:00:00.000Z&to=2026-01-01T00:00:00.000Z',
    )
    expect(res.status).toBe(400)
  })
})
