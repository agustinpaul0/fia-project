import { describe, expect, it } from 'vitest'
import { readError } from '../../testing/http'
import { createInMemoryTeamStaffRepository } from '../../testing/in-memory-team-staff.repository'
import { createInMemoryTeamStaffUnitOfWork } from '../../testing/in-memory-team-staff-unit-of-work'
import { FIA_ADMIN } from '../../testing/session-users'
import { buildCreateTeamStaffBody, buildTeamStaffDto } from '../../testing/team-staff-builders'
import { createTestApp } from '../../testing/test-app'

const TEAM_ID = '00000000-0000-4000-8000-000000000001'
const TEAMS = [{ id: TEAM_ID, name: 'Ferrari' }]

describe('Errores 409 de rutas de personal de escudería', () => {
  it('409 USER_ALREADY_EXISTS si el email ya está registrado', async () => {
    const teamStaffUow = createInMemoryTeamStaffUnitOfWork({
      initialAccounts: [
        {
          id: 'u-1',
          email: 'dup@ferrari.com',
          name: 'Dup',
          role: 'team_staff',
          teamId: TEAM_ID,
          banned: false,
        },
      ],
    })
    const { app } = createTestApp({ teams: TEAMS, sessionUser: FIA_ADMIN, teamStaffUow })
    const body = buildCreateTeamStaffBody({ email: 'dup@ferrari.com', teamId: TEAM_ID })
    const res = await app.request('/team-staff', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    expect(res.status).toBe(409)
    expect((await readError(res)).code).toBe('USER_ALREADY_EXISTS')
  })

  it('409 STAFF_FILE_NUMBER_ALREADY_EXISTS si el legajo ya existe', async () => {
    const existing = buildTeamStaffDto({ fileNumber: 'LEG-1234' })
    const teamStaffUow = createInMemoryTeamStaffUnitOfWork({
      staffRepo: createInMemoryTeamStaffRepository([existing]),
    })
    const { app } = createTestApp({ teams: TEAMS, sessionUser: FIA_ADMIN, teamStaffUow })
    const body = buildCreateTeamStaffBody({ fileNumber: 'LEG-1234', teamId: TEAM_ID })
    const res = await app.request('/team-staff', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    expect(res.status).toBe(409)
    expect((await readError(res)).code).toBe('STAFF_FILE_NUMBER_ALREADY_EXISTS')
  })

  it('409 STAFF_MEMBER_INACTIVE al intentar editar una cuenta dada de baja', async () => {
    const inactive = buildTeamStaffDto({ isActive: false })
    const { app } = createTestApp({ teams: TEAMS, staff: [inactive], sessionUser: FIA_ADMIN })
    const res = await app.request(`/team-staff/${inactive.id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        firstName: 'A',
        lastName: 'B',
        phoneNumber: '+54 9 291 1234567',
        roleInTeam: 'Cargo',
        teamId: TEAM_ID,
        version: 1,
      }),
    })
    expect(res.status).toBe(409)
    expect((await readError(res)).code).toBe('STAFF_MEMBER_INACTIVE')
  })

  it('409 STALE_VERSION si se da de baja con versión vieja', async () => {
    const existing = buildTeamStaffDto({ version: 2 })
    const { app } = createTestApp({ teams: TEAMS, staff: [existing], sessionUser: FIA_ADMIN })
    const res = await app.request(`/team-staff/${existing.id}?version=1`, { method: 'DELETE' })
    expect(res.status).toBe(409)
    expect((await readError(res)).code).toBe('STALE_VERSION')
  })
})
