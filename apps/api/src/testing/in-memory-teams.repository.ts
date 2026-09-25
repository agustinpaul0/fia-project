import type { TeamOption } from '@fia/shared/contracts'
import type { TeamsRepository } from '../features/teams/teams.port'

export const createInMemoryTeamsRepository = (
  initialTeams: readonly TeamOption[] = [],
): TeamsRepository => {
  const teams = new Map<string, TeamOption>(initialTeams.map((t) => [t.id, t]))

  return {
    findAllOptions: async () => [...teams.values()].sort((a, b) => a.name.localeCompare(b.name)),
    exists: async (id) => teams.has(id),
  }
}
