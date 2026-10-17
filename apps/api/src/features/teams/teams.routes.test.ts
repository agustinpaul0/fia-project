import { describe, expect, it } from 'vitest'
import { aDriverRow } from '../../testing/driver-row-builders'
import { FIA_ADMIN, TEAM_STAFF } from '../../testing/session-users'
import { createTestApp } from '../../testing/test-app'

describe('GET /teams', () => {
  const teams = [
    { id: '00000000-0000-4000-8000-000000000001', name: 'Ferrari' },
    { id: '00000000-0000-4000-8000-000000000002', name: 'McLaren' },
  ]

  it('devuelve 401 si no hay sesión iniciada', async () => {
    const { app } = createTestApp({ teams })
    const res = await app.request('/teams')
    expect(res.status).toBe(401)
  })

  it('devuelve 403 si el rol no es fia_admin', async () => {
    const { app } = createTestApp({ teams, sessionUser: TEAM_STAFF })
    const res = await app.request('/teams')
    expect(res.status).toBe(403)
  })

  it('devuelve 200 con la lista de opciones para fia_admin', async () => {
    const { app } = createTestApp({ teams, sessionUser: FIA_ADMIN })
    const res = await app.request('/teams')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual(teams)
  })
})

describe('GET /teams/:id/drivers', () => {
  const ferrari = { id: '00000000-0000-4000-8000-000000000001', name: 'Ferrari' }
  const leclerc = aDriverRow({ teamId: ferrari.id })

  it('lista los pilotos de la escudería para fia_admin', async () => {
    const { app } = createTestApp({
      teams: [ferrari],
      teamDrivers: [leclerc, aDriverRow({ id: '00000000-0000-4000-8000-000000000009' })],
      sessionUser: FIA_ADMIN,
    })
    const res = await app.request(`/teams/${ferrari.id}/drivers`)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([{ id: leclerc.id, name: 'Charles Leclerc' }])
  })

  it('responde 404 si la escudería no existe y 400 si el id es inválido', async () => {
    const { app } = createTestApp({ teams: [ferrari], sessionUser: FIA_ADMIN })
    const missing = await app.request('/teams/00000000-0000-4000-8000-0000000000ff/drivers')
    expect(missing.status).toBe(404)
    expect((await app.request('/teams/invalido/drivers')).status).toBe(400)
  })

  it('sólo lo usa la FIA', async () => {
    const { app } = createTestApp({ teams: [ferrari], sessionUser: TEAM_STAFF })
    expect((await app.request(`/teams/${ferrari.id}/drivers`)).status).toBe(403)
  })
})

describe('GET /teams/:id/races', () => {
  const ferrari = { id: '00000000-0000-4000-8000-000000000001', name: 'Ferrari' }
  const race = {
    id: '00000000-0000-4000-8000-000000000030',
    name: 'GP de Mónaco',
    date: '2026-05-24T13:00:00.000Z',
  }
  const teamRaces = new Map([[ferrari.id, [race]]])

  it('lista las carreras de la categoría de la escudería en la temporada pedida', async () => {
    const { app } = createTestApp({ teams: [ferrari], teamRaces, sessionUser: FIA_ADMIN })
    expect(await (await app.request(`/teams/${ferrari.id}/races?season=2026`)).json()).toEqual([
      race,
    ])
    expect(await (await app.request(`/teams/${ferrari.id}/races?season=2025`)).json()).toEqual([])
  })

  it('exige temporada válida, escudería existente y rol FIA', async () => {
    const { app } = createTestApp({ teams: [ferrari], sessionUser: FIA_ADMIN })
    expect((await app.request(`/teams/${ferrari.id}/races`)).status).toBe(400)
    expect(
      (await app.request('/teams/00000000-0000-4000-8000-0000000000ff/races?season=2026')).status,
    ).toBe(404)
    const staff = createTestApp({ teams: [ferrari], sessionUser: TEAM_STAFF })
    expect((await staff.app.request(`/teams/${ferrari.id}/races?season=2026`)).status).toBe(403)
  })
})
