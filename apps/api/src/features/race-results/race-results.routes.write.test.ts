import { raceClassificationSchema } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import { readError, sendJson } from '../../testing/http'
import {
  aDriver,
  aRaceHeader,
  classificationBody,
  F2_CATEGORY_ID,
  someDrivers,
} from '../../testing/race-builders'
import { FIA_ADMIN, TEAM_STAFF } from '../../testing/session-users'
import { createTestApp } from '../../testing/test-app'

const RACE = aRaceHeader()
const DRIVERS = someDrivers(10)
const PATH = `/races/${RACE.id}/classification`

const put = (body: unknown) => ({ method: 'PUT', path: PATH, body }) as const

const adminApp = () =>
  createTestApp({ races: [RACE], drivers: DRIVERS, sessionUser: FIA_ADMIN }).app

describe('PUT /races/:id/classification', () => {
  it('responde 401 sin sesión y 403 si no es admin FIA', async () => {
    const anonymous = await sendJson(
      createTestApp({ races: [RACE] }).app,
      put(classificationBody(DRIVERS)),
    )
    const staff = createTestApp({ races: [RACE], drivers: DRIVERS, sessionUser: TEAM_STAFF }).app
    expect(anonymous.status).toBe(401)
    expect((await sendJson(staff, put(classificationBody(DRIVERS)))).status).toBe(403)
  })

  it('guarda y devuelve la clasificación con puntos según el contrato', async () => {
    const response = await sendJson(adminApp(), put(classificationBody(DRIVERS)))
    const body = raceClassificationSchema.parse(await response.json())
    expect(response.status).toBe(200)
    expect(body.results[0]).toMatchObject({ position: 1, points: 25 })
    expect(body.race).toMatchObject({ version: 2, resultsRevision: 1 })
  })

  it('rechaza pilotos repetidos con el mensaje en el campo entries', async () => {
    const [first] = DRIVERS
    const body = { version: 1, entries: [{ driverId: first?.id }, { driverId: first?.id }] }
    const error = await readError(await sendJson(adminApp(), put(body)))
    expect(error.fields?.['entries']).toEqual([
      'Un piloto no puede aparecer dos veces en la clasificación.',
    ])
  })

  it('responde 422 DRIVER_NOT_IN_CATEGORY con un piloto de otra categoría', async () => {
    const other = aDriver(30, { categoryId: F2_CATEGORY_ID })
    const app = createTestApp({ races: [RACE], drivers: [other], sessionUser: FIA_ADMIN }).app
    const response = await sendJson(app, put(classificationBody([other])))
    expect(response.status).toBe(422)
    expect((await readError(response)).code).toBe('DRIVER_NOT_IN_CATEGORY')
  })

  it('responde 404 DRIVER_NOT_FOUND con un piloto inexistente', async () => {
    const response = await sendJson(adminApp(), put(classificationBody([aDriver(40)])))
    expect((await readError(response)).code).toBe('DRIVER_NOT_FOUND')
  })

  it('responde 422 RACE_NOT_FINISHED para una carrera futura', async () => {
    const future = aRaceHeader({ date: new Date('2030-01-01T00:00:00.000Z') })
    const app = createTestApp({ races: [future], drivers: DRIVERS, sessionUser: FIA_ADMIN }).app
    const response = await sendJson(app, put(classificationBody(DRIVERS)))
    expect(response.status).toBe(422)
    expect((await readError(response)).code).toBe('RACE_NOT_FINISHED')
  })

  it('el segundo guardado con la misma versión recibe 409 STALE_VERSION', async () => {
    const app = adminApp()
    expect((await sendJson(app, put(classificationBody(DRIVERS)))).status).toBe(200)
    const stale = await sendJson(app, put(classificationBody(DRIVERS)))
    expect(stale.status).toBe(409)
    expect((await readError(stale)).code).toBe('STALE_VERSION')
  })
})
