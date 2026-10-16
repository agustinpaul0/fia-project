import type { DriverOption, TeamOption } from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import type { TeamsRepository } from './teams.port'

export type TeamsService = {
  readonly listOptions: () => Promise<readonly TeamOption[]>
  readonly listDriverOptions: (teamId: string) => Promise<readonly DriverOption[]>
}

export const createTeamsService = (repository: TeamsRepository): TeamsService => ({
  listOptions: () => repository.findAllOptions(),
  listDriverOptions: async (teamId) => {
    if (!(await repository.exists(teamId))) {
      throw new AppError('TEAM_NOT_FOUND')
    }
    return repository.findDriverOptions(teamId)
  },
})
