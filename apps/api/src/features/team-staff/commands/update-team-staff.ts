import type { TeamStaff, UpdateTeamStaffBody } from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import type { TeamsRepository } from '../../teams/teams.port'
import type { TeamStaffUnitOfWork } from '../team-staff-unit-of-work.port'

export type UpdateTeamStaffParams = {
  readonly uow: TeamStaffUnitOfWork
  readonly teams: TeamsRepository
  readonly id: string
  readonly input: UpdateTeamStaffBody
}

export const executeUpdateTeamStaff = async ({
  uow,
  teams,
  id,
  input,
}: UpdateTeamStaffParams): Promise<TeamStaff> => {
  const current = await uow.staff.findById(id)
  if (!current) {
    throw new AppError('STAFF_MEMBER_NOT_FOUND')
  }

  if (!current.isActive) {
    throw new AppError('STAFF_MEMBER_INACTIVE')
  }

  const teamExists = await teams.exists(input.teamId)
  if (!teamExists) {
    throw new AppError('TEAM_NOT_FOUND')
  }

  return uow.run(async ({ staff, accounts }) => {
    const updated = await staff.update(id, input)
    if (!updated) {
      throw new AppError('STALE_VERSION')
    }

    await accounts.updateAccount(current.userId, {
      name: `${input.firstName} ${input.lastName}`,
      teamId: input.teamId,
    })

    return updated
  })
}
