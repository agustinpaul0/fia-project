import { raceSummarySchema } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import { readError, sendJson } from '../../testing/http'
import { aRaceHeader } from '../../testing/race-builders'
import { FIA_ADMIN, TEAM_STAFF } from '../../testing/session-users'
import { createTestApp } from '../../testing/test-app'

const RACE = aRaceHeader()
const PATH = `/races/${RACE.id}`

describe('PUT y DELETE /races/:id (US-19)', () => {
  it('exige autenticación y rol fia_admin', async () => {
    const anonApp = createTestApp({ races: [RACE] }).app
    const staffApp = createTestApp({ races: [RACE], sessionUser: TEAM_STAFF }).app
    const body = { name: 'GP de Mónaco Reprogramado', version: 1 }

    expect((await sendJson(anonApp, { method: 'PUT', path: PATH, body })).status).toBe(401)
    expect((await sendJson(staffApp, { method: 'PUT', path: PATH, body })).status).toBe(403)
  })

  it('modifica un evento programado marcándolo como modified y registrando autor', async () => {
    const app = createTestApp({ races: [RACE], sessionUser: FIA_ADMIN }).app
    const res = await sendJson(app, {
      method: 'PUT',
      path: PATH,
      body: {
        name: 'GP de Mónaco Reprogramado',
        date: '2026-06-07T18:00:00.000Z',
        version: 1,
      },
    })
    expect(res.status).toBe(200)
    const updated = raceSummarySchema.parse(await res.json())
    expect(updated.name).toBe('GP de Mónaco Reprogramado')
    expect(updated.status).toBe('modified')
    expect(updated.updatedByUserId).toBe(FIA_ADMIN.id)
    expect(updated.version).toBe(2)
  })

  it('cancela lógicamente un evento y bloquea ediciones posteriores', async () => {
    const app = createTestApp({ races: [RACE], sessionUser: FIA_ADMIN }).app
    const res = await sendJson(app, {
      method: 'DELETE',
      path: PATH,
      body: { version: 1 },
    })
    expect(res.status).toBe(200)
    const cancelled = raceSummarySchema.parse(await res.json())
    expect(cancelled.status).toBe('cancelled')
    expect(cancelled.version).toBe(2)

    const editAfterCancel = await sendJson(app, {
      method: 'PUT',
      path: PATH,
      body: { name: 'Intento post cancelación', version: 2 },
    })
    expect(editAfterCancel.status).toBe(400)
    expect((await readError(editAfterCancel)).code).toBe('RACE_ALREADY_CANCELLED')
  })

  it('responde 409 STALE_VERSION cuando la versión no coincide', async () => {
    const app = createTestApp({ races: [RACE], sessionUser: FIA_ADMIN }).app
    const stale = await sendJson(app, {
      method: 'PUT',
      path: PATH,
      body: { name: 'Con versión vieja', version: 99 },
    })
    expect(stale.status).toBe(409)
    expect((await readError(stale)).code).toBe('STALE_VERSION')
  })
})
