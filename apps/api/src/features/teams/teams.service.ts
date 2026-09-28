import type { TeamOption } from '@fia/shared/contracts'
import type { TeamsRepository } from './teams.port'

export type TeamsService = {
  readonly listOptions: () => Promise<readonly TeamOption[]>
}

export const createTeamsService = (repository: TeamsRepository): TeamsService => ({
  listOptions: () => repository.findAllOptions(),
})
