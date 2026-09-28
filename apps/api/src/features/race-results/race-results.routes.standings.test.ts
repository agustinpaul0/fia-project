import { driverStandingListSchema } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import { readError, sendJson } from '../../testing/http'
import { aRaceHeader, classificationBody, someDrivers } from '../../testing/race-builders'
import { FIA_ADMIN } from '../../testing/session-users'
import { createTestApp } from '../../testing/test-app'

const RACE = aRaceHeader()
const DRIVERS = someDrivers(3)

describe('GET /races/standings (público)', () => {
  it('devuelve el campeonato de pilotos de la temporada según el contrato', async () => {
    const testApp = createTestApp({ races: [RACE], drivers: DRIVERS, sessionUser: FIA_ADMIN })
    const put = { method: 'PUT', path: `/races/${RACE.id}/classification` } as const
    await sendJson(testApp.app, { ...put, body: classificationBody(DRIVERS) })
    const response = await createTestApp().app.request('/races/standings?season=2025')
    const own = await testApp.app.request('/races/standings?season=2025')
    expect(response.status).toBe(200)
    const standings = driverStandingListSchema.parse(await own.json())
    expect(standings.map((s) => [s.driverCode, s.points, s.wins])).toEqual([
      [DRIVERS[0]?.code, 25, 1],
      [DRIVERS[1]?.code, 18, 0],
      [DRIVERS[2]?.code, 15, 0],
    ])
  })

  it('una temporada sin resultados devuelve una lista vacía', async () => {
    const response = await createTestApp({ races: [RACE] }).app.request(
      '/races/standings?season=2021',
    )
    expect(driverStandingListSchema.parse(await response.json())).toEqual([])
  })

  it('valida la temporada', async () => {
    const response = await createTestApp().app.request('/races/standings')
    expect(response.status).toBe(400)
    expect((await readError(response)).fields).toHaveProperty('season')
  })
})
