import { describe, expect, it } from 'vitest'
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
