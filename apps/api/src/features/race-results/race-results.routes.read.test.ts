import {
  eligibleDriverListSchema,
  raceClassificationSchema,
  raceSummaryListSchema,
} from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import { readError } from '../../testing/http'
import { aRaceHeader, classificationBody, someDrivers } from '../../testing/race-builders'
import { FIA_ADMIN } from '../../testing/session-users'
import { createTestApp } from '../../testing/test-app'

const RACE = aRaceHeader()
const DRIVERS = someDrivers(3)

describe('Lectura pública de carreras y clasificaciones', () => {
  it('lista las carreras de la temporada según el contrato', async () => {
    const { app } = createTestApp({ races: [RACE] })
    const response = await app.request('/races?season=2025')
    expect(response.status).toBe(200)
    expect(raceSummaryListSchema.parse(await response.json())).toHaveLength(1)
  })

  it('filtra las carreras por categoría', async () => {
    const { app } = createTestApp({ races: [RACE] })
    const f1 = await app.request('/races?season=2025&category=F1')
    const f2 = await app.request('/races?season=2025&category=F2')
    expect(raceSummaryListSchema.parse(await f1.json())).toHaveLength(1)
    expect(raceSummaryListSchema.parse(await f2.json())).toEqual([])
  })

  it('exige una temporada válida', async () => {
    const response = await createTestApp().app.request('/races?season=abc')
    expect(response.status).toBe(400)
    expect((await readError(response)).fields).toHaveProperty('season')
  })

  it('muestra la clasificación cargada sin necesidad de sesión', async () => {
    const testApp = createTestApp({ races: [RACE], drivers: DRIVERS })
    await testApp.raceResults.replaceClassification({
      raceId: RACE.id,
      expectedVersion: 1,
      nextRevision: 1,
      entries: classificationBody(DRIVERS).entries.map((entry, i) => ({
        ...entry,
        teamId: DRIVERS[i]?.teamId ?? '',
        position: i + 1,
        points: 0,
      })),
    })
    const response = await testApp.app.request(`/races/${RACE.id}/classification`)
    const body = raceClassificationSchema.parse(await response.json())
    expect(body.results.map((r) => r.driverCode)).toEqual(DRIVERS.map((d) => d.code))
  })

  it('responde 404 RACE_NOT_FOUND para una carrera inexistente', async () => {
    const response = await createTestApp().app.request(`/races/${RACE.id}/classification`)
    expect(response.status).toBe(404)
    expect((await readError(response)).code).toBe('RACE_NOT_FOUND')
  })

  it('responde 400 si el id no es un UUID', async () => {
    const response = await createTestApp().app.request('/races/xyz/classification')
    expect((await readError(response)).fields).toHaveProperty('id')
  })
})

describe('GET /races/:id/drivers', () => {
  it('devuelve los pilotos de la categoría de la carrera sólo al admin FIA', async () => {
    const other = someDrivers(4).map((d) => ({ ...d, categoryId: 'otra' }))
    const options = { races: [RACE], drivers: [...DRIVERS, ...other.slice(3)] }
    const anonymous = await createTestApp(options).app.request(`/races/${RACE.id}/drivers`)
    const admin = createTestApp({ ...options, sessionUser: FIA_ADMIN }).app
    const response = await admin.request(`/races/${RACE.id}/drivers`)
    expect(anonymous.status).toBe(401)
    expect(eligibleDriverListSchema.parse(await response.json()).map((d) => d.id)).toEqual(
      DRIVERS.map((d) => d.id),
    )
  })
})
