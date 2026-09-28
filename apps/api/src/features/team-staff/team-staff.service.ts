import type { CreateTeamStaffBody, TeamStaff, UpdateTeamStaffBody } from '@fia/shared/contracts'
import type { TeamsRepository } from '../teams/teams.port'
import { executeCreateTeamStaff } from './commands/create-team-staff'
import { executeDeactivateTeamStaff } from './commands/deactivate-team-staff'
import { executeUpdateTeamStaff } from './commands/update-team-staff'
import type { TeamStaffUnitOfWork } from './team-staff-unit-of-work.port'

export type TeamStaffDependencies = {
  readonly uow: TeamStaffUnitOfWork
  readonly teams: TeamsRepository
}

export type TeamStaffService = {
  readonly list: () => Promise<readonly TeamStaff[]>
  readonly create: (input: CreateTeamStaffBody) => Promise<TeamStaff>
  readonly update: (id: string, input: UpdateTeamStaffBody) => Promise<TeamStaff>
  readonly deactivate: (id: string, version: number, deactivatedBy: string) => Promise<void>
}

export const createTeamStaffService = ({
  uow,
  teams,
}: TeamStaffDependencies): TeamStaffService => ({
  list: () => uow.staff.findAll(),
  create: (input) => executeCreateTeamStaff(uow, teams, input),
  update: (id, input) => executeUpdateTeamStaff({ uow, teams, id, input }),
  deactivate: (id, version, deactivatedBy) =>
    executeDeactivateTeamStaff({ uow, id, version, deactivatedBy }),
})
