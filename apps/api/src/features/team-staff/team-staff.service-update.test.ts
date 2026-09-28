import { describe, expect, it } from 'vitest'
import { createInMemoryTeamStaffRepository } from '../../testing/in-memory-team-staff.repository'
import { createInMemoryTeamStaffUnitOfWork } from '../../testing/in-memory-team-staff-unit-of-work'
import { createInMemoryTeamsRepository } from '../../testing/in-memory-teams.repository'
import { buildTeamStaffDto } from '../../testing/team-staff-builders'
import { createTeamStaffService } from './team-staff.service'

const TEAM_1 = '00000000-0000-4000-8000-000000000001'
const TEAM_2 = '00000000-0000-4000-8000-000000000002'
const TEAMS = [
  { id: TEAM_1, name: 'Ferrari' },
  { id: TEAM_2, name: 'McLaren' },
]

describe('TeamStaffService - Edición', () => {
  it('actualiza datos editables e incrementa versión', async () => {
    const existing = buildTeamStaffDto({ teamId: TEAM_1, version: 1 })
    const staffRepo = createInMemoryTeamStaffRepository([existing])
    const uow = createInMemoryTeamStaffUnitOfWork({ staffRepo })
    const teams = createInMemoryTeamsRepository(TEAMS)
    const service = createTeamStaffService({ uow, teams })

    const updated = await service.update(existing.id, {
      firstName: 'Carlos',
      lastName: 'Sainz',
      phoneNumber: '+54 9 291 9999999',
      roleInTeam: 'Director',
      teamId: TEAM_2,
      version: 1,
    })

    expect(updated).toMatchObject({
      firstName: 'Carlos',
      lastName: 'Sainz',
      phoneNumber: '+54 9 291 9999999',
      roleInTeam: 'Director',
      teamId: TEAM_2,
      version: 2,
    })
  })

  const dummyUpdate = {
    firstName: 'A',
    lastName: 'B',
    phoneNumber: '+54 9 291 1234567',
    roleInTeam: 'Cargo',
    teamId: TEAM_1,
    version: 1,
  }

  it('rechaza edición con STAFF_MEMBER_NOT_FOUND si no existe', async () => {
    const uow = createInMemoryTeamStaffUnitOfWork()
    const teams = createInMemoryTeamsRepository(TEAMS)
    const service = createTeamStaffService({ uow, teams })

    await expect(
      service.update('00000000-0000-4000-8000-999999999999', dummyUpdate),
    ).rejects.toMatchObject({ code: 'STAFF_MEMBER_NOT_FOUND' })
  })

  it('rechaza edición con STAFF_MEMBER_INACTIVE si está dado de baja', async () => {
    const inactive = buildTeamStaffDto({ isActive: false })
    const staffRepo = createInMemoryTeamStaffRepository([inactive])
    const uow = createInMemoryTeamStaffUnitOfWork({ staffRepo })
    const teams = createInMemoryTeamsRepository(TEAMS)
    const service = createTeamStaffService({ uow, teams })

    await expect(service.update(inactive.id, dummyUpdate)).rejects.toMatchObject({
      code: 'STAFF_MEMBER_INACTIVE',
    })
  })

  it('rechaza edición con STALE_VERSION si la versión difiere', async () => {
    const existing = buildTeamStaffDto({ version: 2 })
    const staffRepo = createInMemoryTeamStaffRepository([existing])
    const uow = createInMemoryTeamStaffUnitOfWork({ staffRepo })
    const teams = createInMemoryTeamsRepository(TEAMS)
    const service = createTeamStaffService({ uow, teams })

    await expect(service.update(existing.id, dummyUpdate)).rejects.toMatchObject({
      code: 'STALE_VERSION',
    })
  })
})
