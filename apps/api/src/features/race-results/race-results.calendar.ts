import type * as C from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import { findActiveOrFail, findOrFail } from './race-results.lookup'
import { toRaceSummary } from './race-results.mapper'
import type { RaceResultsRepository } from './race-results.port'

export type RaceCalendarService = {
  readonly updateRace: (
    raceId: string,
    body: C.UpdateRaceBody,
    userId: string,
  ) => Promise<C.RaceSummary>
  readonly cancelRace: (raceId: string, version: number, userId: string) => Promise<C.RaceSummary>
  readonly listCircuits: () => Promise<readonly C.CircuitOption[]>
}

const runRaceMutation = async (
  repo: RaceResultsRepository,
  id: string,
  run: () => Promise<boolean>,
): Promise<C.RaceSummary> => {
  await findActiveOrFail(repo, id)
  if (!(await run())) {
    throw new AppError('STALE_VERSION')
  }
  return toRaceSummary(await findOrFail(repo, id))
}

export const createRaceCalendarService = (repo: RaceResultsRepository): RaceCalendarService => ({
  updateRace: async (id, body, userId) => {
    if (!(await repo.listCircuits()).some((c) => c.id === body.circuitId)) {
      throw new AppError('CIRCUIT_NOT_FOUND')
    }
    return runRaceMutation(repo, id, () => repo.updateRace(id, body, userId))
  },
  cancelRace: (id, version, userId) =>
    runRaceMutation(repo, id, () => repo.cancelRace(id, version, userId)),
  listCircuits: () => repo.listCircuits(),
})
