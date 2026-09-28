import { describe, expect, it } from 'vitest'
import { createInMemoryTeamStaffRepository } from '../../testing/in-memory-team-staff.repository'
import { createInMemoryStaffAccounts } from '../../testing/in-memory-team-staff-accounts'
import { createInMemoryTeamStaffUnitOfWork } from '../../testing/in-memory-team-staff-unit-of-work'
import { createInMemoryTeamsRepository } from '../../testing/in-memory-teams.repository'
import { buildTeamStaffDto } from '../../testing/team-staff-builders'
import { createTeamStaffService } from './team-staff.service'

describe('TeamStaffService - Baja lógica', () => {
  it('da de baja la cuenta y banea el usuario en Better Auth', async () => {
    const existing = buildTeamStaffDto({ userId: 'u-1', version: 1, isActive: true })
    const staffRepo = createInMemoryTeamStaffRepository([existing])
    const accountsRepo = createInMemoryStaffAccounts([
      {
        id: 'u-1',
        email: 'test@ferrari.com',
        name: 'Test',
        role: 'team_staff',
        teamId: 't-1',
        banned: false,
      },
    ])
    const uow = createInMemoryTeamStaffUnitOfWork({ staffRepo, accountsRepo })
    const teams = createInMemoryTeamsRepository()
    const service = createTeamStaffService({ uow, teams })

    await service.deactivate(existing.id, 1, 'admin-1')

    const after = await staffRepo.findById(existing.id)
    expect(after?.isActive).toBe(false)
    expect(after?.deactivatedAt).not.toBeNull()
    expect(after?.version).toBe(2)
    expect(accountsRepo.accounts.get('u-1')?.banned).toBe(true)
  })

  it('es idempotente si ya está dada de baja con la misma versión', async () => {
    const inactive = buildTeamStaffDto({ version: 2, isActive: false })
    const staffRepo = createInMemoryTeamStaffRepository([inactive])
    const uow = createInMemoryTeamStaffUnitOfWork({ staffRepo })
    const teams = createInMemoryTeamsRepository()
    const service = createTeamStaffService({ uow, teams })

    await expect(service.deactivate(inactive.id, 2, 'admin-1')).resolves.toBeUndefined()
  })

  it('rechaza baja con STALE_VERSION si la versión no coincide', async () => {
    const existing = buildTeamStaffDto({ version: 2 })
    const staffRepo = createInMemoryTeamStaffRepository([existing])
    const uow = createInMemoryTeamStaffUnitOfWork({ staffRepo })
    const teams = createInMemoryTeamsRepository()
    const service = createTeamStaffService({ uow, teams })

    await expect(service.deactivate(existing.id, 1, 'admin-1')).rejects.toMatchObject({
      code: 'STALE_VERSION',
    })
  })

  it('rechaza baja con STAFF_MEMBER_NOT_FOUND si no existe', async () => {
    const uow = createInMemoryTeamStaffUnitOfWork()
    const teams = createInMemoryTeamsRepository()
    const service = createTeamStaffService({ uow, teams })

    await expect(
      service.deactivate('00000000-0000-4000-8000-999999999999', 1, 'admin-1'),
    ).rejects.toMatchObject({ code: 'STAFF_MEMBER_NOT_FOUND' })
  })
})
