import type {
  CreateTechnicalControlBody,
  TechnicalControl,
  TechnicalControlsQuery,
} from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import type { TechnicalControlsRepository } from './technical-controls.port'

export type TechnicalControlsService = {
  readonly list: (filter: TechnicalControlsQuery) => Promise<readonly TechnicalControl[]>
  readonly create: (body: CreateTechnicalControlBody) => Promise<TechnicalControl>
}

export const createTechnicalControlsService = (
  repo: TechnicalControlsRepository,
  now: () => Date = () => new Date(),
): TechnicalControlsService => ({
  list: (filter) => repo.list({ ...filter, activeAt: now() }),
  create: async (body) => {
    if (body.driverId !== null && body.driverId !== undefined) {
      const belongs = await repo.driverBelongsToTeam(body.driverId, body.teamId)
      if (!belongs) {
        throw new AppError('INVALID_TECHNICAL_CONTROL_TARGET')
      }
    }
    return repo.create(body)
  },
})
