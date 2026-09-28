import { describe, expect, it } from 'vitest'
import { createInMemoryTeamStaffUnitOfWork } from '../../testing/in-memory-team-staff-unit-of-work'
import { createInMemoryTeamsRepository } from '../../testing/in-memory-teams.repository'
import { buildCreateTeamStaffBody, buildTeamStaffDto } from '../../testing/team-staff-builders'
import { createTeamStaffService } from './team-staff.service'

const TEAM_ID = '00000000-0000-4000-8000-000000000010'
const TEAMS = [{ id: TEAM_ID, name: 'Ferrari' }]

describe('TeamStaffService - Creación y listado', () => {
  it('crea un miembro de personal y lista activos e inactivos', async () => {
    const uow = createInMemoryTeamStaffUnitOfWork()
    const teams = createInMemoryTeamsRepository(TEAMS)
    const service = createTeamStaffService({ uow, teams })

    const input = buildCreateTeamStaffBody({ teamId: TEAM_ID })
    const created = await service.create(input)

    expect(created).toMatchObject({
      firstName: input.firstName,
      lastName: input.lastName,
      fileNumber: input.fileNumber,
      teamId: TEAM_ID,
      isActive: true,
      version: 1,
    })

    const list = await service.list()
    expect(list).toHaveLength(1)
    expect(list[0]?.id).toBe(created.id)
  })

  it('rechaza el alta si la escudería no existe con TEAM_NOT_FOUND', async () => {
    const uow = createInMemoryTeamStaffUnitOfWork()
    const teams = createInMemoryTeamsRepository(TEAMS)
    const service = createTeamStaffService({ uow, teams })

    const input = buildCreateTeamStaffBody({ teamId: '00000000-0000-4000-8000-999999999999' })
    await expect(service.create(input)).rejects.toMatchObject({ code: 'TEAM_NOT_FOUND' })
  })

  it('rechaza el alta si el legajo ya existe con STAFF_FILE_NUMBER_ALREADY_EXISTS', async () => {
    const existing = buildTeamStaffDto({ fileNumber: 'LEG-1234' })
    const uow = createInMemoryTeamStaffUnitOfWork({
      staffRepo: (
        await import('../../testing/in-memory-team-staff.repository')
      ).createInMemoryTeamStaffRepository([existing]),
    })
    const teams = createInMemoryTeamsRepository(TEAMS)
    const service = createTeamStaffService({ uow, teams })

    const input = buildCreateTeamStaffBody({ teamId: TEAM_ID, fileNumber: 'LEG-1234' })
    await expect(service.create(input)).rejects.toMatchObject({
      code: 'STAFF_FILE_NUMBER_ALREADY_EXISTS',
    })
  })

  it('rechaza el alta si el email ya existe con USER_ALREADY_EXISTS', async () => {
    const uow = createInMemoryTeamStaffUnitOfWork({
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
    const teams = createInMemoryTeamsRepository(TEAMS)
    const service = createTeamStaffService({ uow, teams })

    const input = buildCreateTeamStaffBody({ email: 'dup@ferrari.com', teamId: TEAM_ID })
    await expect(service.create(input)).rejects.toMatchObject({ code: 'USER_ALREADY_EXISTS' })
  })
})
