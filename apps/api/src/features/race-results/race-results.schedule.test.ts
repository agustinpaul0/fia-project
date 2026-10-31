import { circuitOptionListSchema, raceSummarySchema } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import { readError, sendJson } from '../../testing/http'
import { aRaceHeader, OTHER_CIRCUIT } from '../../testing/race-builders'
import { FIA_ADMIN, TEAM_STAFF } from '../../testing/session-users'
import { createTestApp } from '../../testing/test-app'

const RACE = aRaceHeader()
const PATH = `/races/${RACE.id}`
const BODY = {
  name: 'GP de Mónaco Reprogramado',
  date: '2026-06-07T18:00:00.000Z',
  type: 'grand_prix',
  circuitId: OTHER_CIRCUIT.id,
  version: 1,
}
const admin = () => createTestApp({ races: [RACE], sessionUser: FIA_ADMIN })

describe('PUT y DELETE /races/:id (US-19)', () => {
  it('un rol distinto de la FIA recibe 401/403', async () => {
    const anon = createTestApp({ races: [RACE] }).app
    const staff = createTestApp({ races: [RACE], sessionUser: TEAM_STAFF }).app
    expect((await sendJson(anon, { method: 'PUT', path: PATH, body: BODY })).status).toBe(401)
    expect((await sendJson(staff, { method: 'PUT', path: PATH, body: BODY })).status).toBe(403)
    expect(
      (await sendJson(staff, { method: 'DELETE', path: PATH, body: { version: 1 } })).status,
    ).toBe(403)
    expect((await staff.request('/races/circuits')).status).toBe(403)
  })

  it('modifica fecha, hora, circuito y tipo, lo marca "modified" y registra quién', async () => {
    const { app, raceResults } = admin()
    const res = await sendJson(app, {
      method: 'PUT',
      path: PATH,
      body: { ...BODY, type: 'sprint' },
    })
    expect(raceSummarySchema.parse(await res.json())).toMatchObject({
      date: BODY.date,
      type: 'sprint',
      circuitId: OTHER_CIRCUIT.id,
      circuitName: OTHER_CIRCUIT.name,
      status: 'modified',
      version: 2,
    })
    expect(raceResults.audit.get(RACE.id)).toBe(FIA_ADMIN.id)
  })

  it('la baja es lógica: el evento sigue listado como cancelado y no se puede editar', async () => {
    const { app, raceResults } = admin()
    const res = await sendJson(app, { method: 'DELETE', path: PATH, body: { version: 1 } })
    expect(raceSummarySchema.parse(await res.json()).status).toBe('cancelled')
    expect(raceResults.audit.get(RACE.id)).toBe(FIA_ADMIN.id)
    const list = await (await app.request('/races?season=2025')).json()
    expect(list).toEqual([expect.objectContaining({ id: RACE.id, status: 'cancelled' })])
    const again = await sendJson(app, { method: 'PUT', path: PATH, body: { ...BODY, version: 2 } })
    expect(again.status).toBe(409)
    expect((await readError(again)).code).toBe('RACE_ALREADY_CANCELLED')
  })

  it.each([
    [{ name: 'Sólo nombre', version: 1 }, 'date'],
    [{ ...BODY, date: '07/06/2026' }, 'date'],
    [{ ...BODY, name: '' }, 'name'],
  ])('rechaza datos faltantes o fecha inválida con mensaje claro (%o)', async (body, field) => {
    const res = await sendJson(admin().app, { method: 'PUT', path: PATH, body })
    const error = await readError(res)
    expect(res.status).toBe(400)
    expect(error.fields?.[field]?.[0]).toMatch(/[a-záéíóú]/i)
  })

  it('un circuito inexistente o una versión vieja se rechazan', async () => {
    const { app } = admin()
    const ghost = { ...BODY, circuitId: '00000000-0000-4000-8000-0000000000ff' }
    expect(
      (await readError(await sendJson(app, { method: 'PUT', path: PATH, body: ghost }))).code,
    ).toBe('CIRCUIT_NOT_FOUND')
    const stale = await sendJson(app, { method: 'PUT', path: PATH, body: { ...BODY, version: 9 } })
    expect((await readError(stale)).code).toBe('STALE_VERSION')
  })

  it('la FIA obtiene los circuitos para el formulario', async () => {
    const res = await admin().app.request('/races/circuits')
    expect(circuitOptionListSchema.parse(await res.json())).toHaveLength(2)
  })
})
