import type { CreatePenaltyBody, Penalty } from '@fia/shared/contracts'
import type { PenaltiesListFilter, PenaltiesRepository } from '../features/penalties/penalties.port'

export type InMemoryPenaltiesRepository = PenaltiesRepository & {
  readonly penalties: Penalty[]
}

export const createInMemoryPenaltiesRepository = (
  initial: readonly Penalty[] = [],
  driverTeams: ReadonlyMap<string, string> = new Map(),
): InMemoryPenaltiesRepository => {
  const penalties: Penalty[] = [...initial]

  return {
    penalties,
    list: async (filter: PenaltiesListFilter) => {
      let result = penalties.filter((p) => new Date(p.issuedAt) >= filter.issuedSince)
      if (filter.teamId) {
        result = result.filter((p) => p.teamId === filter.teamId)
      }
      if (filter.type) {
        result = result.filter((p) => p.type === filter.type)
      }
      if (filter.season) {
        result = result.filter((p) => new Date(p.issuedAt).getUTCFullYear() === filter.season)
      }
      return result
    },
    create: async (body: CreatePenaltyBody) => {
      const now = new Date().toISOString()
      const penalty: Penalty = {
        id: `00000000-0000-4000-8000-${String(penalties.length + 1).padStart(12, '0')}`,
        teamId: body.teamId,
        teamName: 'Test Team',
        driverId: body.driverId ?? null,
        driverName: body.driverId ? 'Test Driver' : null,
        raceId: body.raceId ?? null,
        raceName: body.raceId ? 'Test Race' : null,
        type: body.type,
        penalty: body.penalty,
        reason: body.reason,
        issuedAt: body.issuedAt ?? now,
        version: 1,
        createdAt: now,
      }
      penalties.push(penalty)
      return penalty
    },
    driverBelongsToTeam: async (driverId, teamId) =>
      driverTeams.has(driverId) ? driverTeams.get(driverId) === teamId : true,
  }
}
