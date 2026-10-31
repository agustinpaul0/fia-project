import type { CreatePenaltyBody, Penalty } from '@fia/shared/contracts'
import type { PenaltiesListFilter, PenaltiesRepository } from '../features/penalties/penalties.port'

export type InMemoryPenaltiesRepository = PenaltiesRepository & {
  readonly penalties: Penalty[]
}

const buildPenaltyRow = (body: CreatePenaltyBody, seq: number): Penalty => {
  const now = new Date().toISOString()
  return {
    id: `00000000-0000-4000-8000-${String(seq).padStart(12, '0')}`,
    teamId: body.teamId,
    teamName: 'Test Team',
    categoryCode: 'F1',
    driverId: body.driverId ?? null,
    driverName: body.driverId ? 'Test Driver' : null,
    raceId: body.raceId ?? null,
    raceName: body.raceId ? 'Test Race' : null,
    type: body.type,
    penalty: body.penalty,
    reason: body.reason,
    issuedAt: body.issuedAt ?? now,
    confirmedAt: null,
    confirmedByName: null,
    notificationStatus: 'pending',
    version: 1,
    createdAt: now,
  }
}

const inRange = (iso: string, filter: PenaltiesListFilter): boolean => {
  const at = new Date(iso)
  return (
    at >= filter.issuedSince &&
    (!filter.from || at >= new Date(filter.from)) &&
    (!filter.to || at <= new Date(filter.to)) &&
    (!filter.season || at.getUTCFullYear() === filter.season)
  )
}

const byDate = (sort: PenaltiesListFilter['sort']) => (a: Penalty, b: Penalty) =>
  sort === 'date_asc' ? a.issuedAt.localeCompare(b.issuedAt) : b.issuedAt.localeCompare(a.issuedAt)

const filterPenalties = (
  items: readonly Penalty[],
  filter: PenaltiesListFilter,
): readonly Penalty[] =>
  [...items]
    .sort(byDate(filter.sort))
    .filter(
      (p) =>
        inRange(p.issuedAt, filter) &&
        (!filter.teamId || p.teamId === filter.teamId) &&
        (!filter.driverId || p.driverId === filter.driverId) &&
        (!filter.type || p.type === filter.type),
    )

export const createInMemoryPenaltiesRepository = (
  initial: readonly Penalty[] = [],
  driverTeams: ReadonlyMap<string, string> = new Map(),
): InMemoryPenaltiesRepository => {
  const penalties: Penalty[] = [...initial]

  return {
    penalties,
    list: async (filter) => filterPenalties(penalties, filter),
    findById: async (id) => penalties.find((p) => p.id === id) ?? null,
    create: async (body) => {
      const penalty = buildPenaltyRow(body, penalties.length + 1)
      penalties.push(penalty)
      return penalty
    },
    confirm: async ({ id, userId, confirmedAt, version }) => {
      const index = penalties.findIndex((p) => p.id === id && p.version === version)
      const current = penalties[index]
      if (!current || current.confirmedAt) {
        return null
      }
      const updated: Penalty = {
        ...current,
        confirmedAt: confirmedAt.toISOString(),
        confirmedByName: userId,
        notificationStatus: 'confirmed',
        version: current.version + 1,
      }
      penalties[index] = updated
      return updated
    },
    driverBelongsToTeam: async (driverId, teamId) =>
      driverTeams.has(driverId) ? driverTeams.get(driverId) === teamId : true,
  }
}
