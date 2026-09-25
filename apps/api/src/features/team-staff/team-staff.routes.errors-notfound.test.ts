import { describe, expect, it } from 'vitest'
import { FIA_ADMIN } from '../../testing/session-users'
import { buildCreateTeamStaffBody } from '../../testing/team-staff-builders'
import { createTestApp } from '../../testing/test-app'

type ErrorResponse = { error: { code: string } }
const TEAMS = [{ id: '00000000-0000-4000-8000-000000000001', name: 'Ferrari' }]

describe('Errores 400 y 404 de rutas de personal de escudería', () => {
  it('400 VALIDATION_FAILED con body inválido', async () => {
    const { app } = createTestApp({ teams: TEAMS, sessionUser: FIA_ADMIN })
    const res = await app.request('/team-staff', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ firstName: '' }),
    })
    expect(res.status).toBe(400)
    const body = (await res.json()) as ErrorResponse
    expect(body.error.code).toBe('VALIDATION_FAILED')
  })

  it('404 TEAM_NOT_FOUND si la escudería no existe', async () => {
    const { app } = createTestApp({ teams: TEAMS, sessionUser: FIA_ADMIN })
    const payload = buildCreateTeamStaffBody({ teamId: '00000000-0000-4000-8000-999999999999' })
    const res = await app.request('/team-staff', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
    expect(res.status).toBe(404)
    const body = (await res.json()) as ErrorResponse
    expect(body.error.code).toBe('TEAM_NOT_FOUND')
  })

  it('404 STAFF_MEMBER_NOT_FOUND si el miembro no existe', async () => {
    const { app } = createTestApp({ teams: TEAMS, sessionUser: FIA_ADMIN })
    const res = await app.request('/team-staff/00000000-0000-4000-8000-999999999999?version=1', {
      method: 'DELETE',
    })
    expect(res.status).toBe(404)
    const body = (await res.json()) as ErrorResponse
    expect(body.error.code).toBe('STAFF_MEMBER_NOT_FOUND')
  })
})
