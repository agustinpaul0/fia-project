import type { CreateTeamStaffBody, TeamStaff } from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import type { TeamsRepository } from '../../teams/teams.port'
import type { TeamStaffUnitOfWork } from '../team-staff-unit-of-work.port'

export const executeCreateTeamStaff = async (
  uow: TeamStaffUnitOfWork,
  teams: TeamsRepository,
  input: CreateTeamStaffBody,
): Promise<TeamStaff> => {
  const teamExists = await teams.exists(input.teamId)
  if (!teamExists) {
    throw new AppError('TEAM_NOT_FOUND')
  }

  const existingFileNumber = await uow.staff.findByFileNumber(input.fileNumber)
  if (existingFileNumber) {
    throw new AppError('STAFF_FILE_NUMBER_ALREADY_EXISTS')
  }

  return uow.run(async ({ staff, accounts }) => {
    const { userId } = await accounts.createAccount({
      email: input.email,
      password: input.password,
      name: `${input.firstName} ${input.lastName}`,
      role: 'team_staff',
      teamId: input.teamId,
    })

    return staff.create({
      userId,
      teamId: input.teamId,
      firstName: input.firstName,
      lastName: input.lastName,
      roleInTeam: input.roleInTeam,
      phoneNumber: input.phoneNumber,
      fileNumber: input.fileNumber,
    })
  })
}
