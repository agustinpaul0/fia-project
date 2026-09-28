import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse, mockFetchOnce } from '@/testing/mock-fetch'
import { aTeamStaffMember } from '@/testing/team-staff-builders'
import { createTeamStaff } from './create-team-staff'
import { deactivateTeamStaff } from './deactivate-team-staff'
import { fetchTeamStaff } from './fetch-team-staff'
import { updateTeamStaff } from './update-team-staff'

describe('Team Staff API clients', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fetchTeamStaff obtiene la lista de miembros', async () => {
    const list = [aTeamStaffMember()]
    mockFetchOnce(jsonResponse(list))
    const res = await fetchTeamStaff()
    expect(res).toEqual(list)
  })

  it('createTeamStaff crea un nuevo miembro', async () => {
    const member = aTeamStaffMember()
    mockFetchOnce(jsonResponse(member, 201))
    const res = await createTeamStaff({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      password: 'Password123!',
      teamId: member.teamId,
      roleInTeam: member.roleInTeam,
      phoneNumber: member.phoneNumber,
      fileNumber: member.fileNumber,
    })
    expect(res).toEqual(member)
  })

  it('updateTeamStaff actualiza un miembro', async () => {
    const member = aTeamStaffMember({ version: 2 })
    mockFetchOnce(jsonResponse(member))
    const res = await updateTeamStaff({
      id: member.id,
      body: {
        firstName: 'Nuevo',
        lastName: 'Nombre',
        teamId: member.teamId,
        roleInTeam: 'Rol',
        phoneNumber: '+54 9 291 1234567',
        version: 1,
      },
    })
    expect(res).toEqual(member)
  })

  it('deactivateTeamStaff da de baja un miembro', async () => {
    mockFetchOnce(new Response(null, { status: 204 }))
    const res = await deactivateTeamStaff({
      id: '00000000-0000-4000-8000-000000000001',
      version: 1,
    })
    expect(res).toBeNull()
  })
})
