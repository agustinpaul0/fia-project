import type { CreatePenaltyBody, PenaltiesQuery, Penalty } from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import type { PenaltiesRepository } from './penalties.port'

export type PenaltiesService = {
  readonly list: (filter: PenaltiesQuery) => Promise<readonly Penalty[]>
  readonly create: (body: CreatePenaltyBody) => Promise<Penalty>
}

export const PENALTY_RETENTION_YEARS = 5

const retentionStart = (now: Date): Date => {
  const start = new Date(now)
  start.setUTCFullYear(start.getUTCFullYear() - PENALTY_RETENTION_YEARS)
  return start
}

export const createPenaltiesService = (
  repo: PenaltiesRepository,
  now: () => Date = () => new Date(),
): PenaltiesService => ({
  list: (filter) => repo.list({ ...filter, issuedSince: retentionStart(now()) }),
  create: async (body) => {
    if (body.driverId !== null && body.driverId !== undefined) {
      const belongs = await repo.driverBelongsToTeam(body.driverId, body.teamId)
      if (!belongs) {
        throw new AppError('INVALID_PENALTY_TARGET')
      }
    }
    return repo.create(body)
  },
})
