import { teamStaffSchema } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import { FIA_ADMIN, TEAM_STAFF } from '../../testing/session-users'
import { buildCreateTeamStaffBody, buildTeamStaffDto } from '../../testing/team-staff-builders'
import { createTestApp } from '../../testing/test-app'

const TEAM_ID = '00000000-0000-4000-8000-000000000001'
const TEAMS = [{ id: TEAM_ID, name: 'Ferrari' }]

describe('Escritura de personal de escudería (rutas)', () => {
  it('POST /team-staff crea y responde 201 con el esquema correcto', async () => {
    const { app } = createTestApp({ teams: TEAMS, sessionUser: FIA_ADMIN })
    const body = buildCreateTeamStaffBody({ teamId: TEAM_ID })
    const res = await app.request('/team-staff', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })

    expect(res.status).toBe(201)
    const json = await res.json()
    expect(teamStaffSchema.safeParse(json).success).toBe(true)
    expect(json).toMatchObject({ firstName: body.firstName, lastName: body.lastName, version: 1 })
  })

  it('PUT /team-staff/:id actualiza y responde 200 con versión incrementada', async () => {
    const existing = buildTeamStaffDto({ teamId: TEAM_ID, version: 1 })
    const { app } = createTestApp({ teams: TEAMS, staff: [existing], sessionUser: FIA_ADMIN })
    const updateBody = {
      firstName: 'Nuevo',
      lastName: 'Apellido',
      phoneNumber: '+54 9 291 5555555',
      roleInTeam: 'Ingeniero Jefe',
      teamId: TEAM_ID,
      version: 1,
    }

    const res = await app.request(`/team-staff/${existing.id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(updateBody),
    })

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(teamStaffSchema.safeParse(json).success).toBe(true)
    expect(json).toMatchObject({ firstName: 'Nuevo', version: 2 })
  })

  it('DELETE /team-staff/:id?version=N da de baja y responde 204 sin cuerpo', async () => {
    const existing = buildTeamStaffDto({ teamId: TEAM_ID, version: 1 })
    const { app } = createTestApp({ teams: TEAMS, staff: [existing], sessionUser: FIA_ADMIN })

    const res = await app.request(`/team-staff/${existing.id}?version=1`, { method: 'DELETE' })
    expect(res.status).toBe(204)
    expect(await res.text()).toBe('')
  })

  it('rechaza acciones de escritura con 401 si no hay sesión y 403 con otro rol', async () => {
    const { app: noAuthApp } = createTestApp({ teams: TEAMS })
    const { app: staffApp } = createTestApp({ teams: TEAMS, sessionUser: TEAM_STAFF })

    const resPost401 = await noAuthApp.request('/team-staff', { method: 'POST', body: '{}' })
    expect(resPost401.status).toBe(401)

    const resPost403 = await staffApp.request('/team-staff', { method: 'POST', body: '{}' })
    expect(resPost403.status).toBe(403)
  })
})
