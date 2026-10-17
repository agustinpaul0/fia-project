import type { DriverOption, TeamOption, TeamRaceOption } from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import type { TeamsRepository } from './teams.port'

export type TeamsService = {
  readonly listOptions: () => Promise<readonly TeamOption[]>
  readonly listDriverOptions: (teamId: string) => Promise<readonly DriverOption[]>
  readonly listRaceOptions: (teamId: string, season: number) => Promise<readonly TeamRaceOption[]>
}

const assertTeam = async (repository: TeamsRepository, teamId: string): Promise<void> => {
  if (!(await repository.exists(teamId))) {
    throw new AppError('TEAM_NOT_FOUND')
  }
}

export const createTeamsService = (repository: TeamsRepository): TeamsService => ({
  listOptions: () => repository.findAllOptions(),
  listDriverOptions: async (teamId) => {
    await assertTeam(repository, teamId)
    return repository.findDriverOptions(teamId)
  },
  listRaceOptions: async (teamId, season) => {
    await assertTeam(repository, teamId)
    return repository.findRaceOptions(teamId, season)
  },
})
