import type { CreatePenaltyBody, PenaltiesQuery, Penalty } from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import type { PenaltiesRepository } from './penalties.port'

export type PenaltiesService = {
  readonly list: (filter: PenaltiesQuery) => Promise<readonly Penalty[]>
  readonly create: (body: CreatePenaltyBody) => Promise<Penalty>
}

export const createPenaltiesService = (repo: PenaltiesRepository): PenaltiesService => ({
  list: (filter) => repo.list(filter),
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
