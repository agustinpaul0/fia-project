import type { TeamOption, TeamRaceOption } from '@fia/shared/contracts'
import type { DriverRow } from '@fia/shared/db'
import type { TeamsRepository } from '../features/teams/teams.port'

export const createInMemoryTeamsRepository = (
  initialTeams: readonly TeamOption[] = [],
  drivers: readonly DriverRow[] = [],
  teamRaces: ReadonlyMap<string, readonly TeamRaceOption[]> = new Map(),
): TeamsRepository => {
  const teams = new Map<string, TeamOption>(initialTeams.map((t) => [t.id, t]))

  return {
    findAllOptions: async () => [...teams.values()].sort((a, b) => a.name.localeCompare(b.name)),
    exists: async (id) => teams.has(id),
    findDriverOptions: async (teamId) =>
      drivers
        .filter((d) => d.teamId === teamId)
        .map((d) => ({ id: d.id, name: `${d.firstName} ${d.lastName}` })),
    findRaceOptions: async (teamId, season) =>
      (teamRaces.get(teamId) ?? []).filter((r) => new Date(r.date).getUTCFullYear() === season),
  }
}
