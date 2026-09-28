import type {
  EligibleDriver,
  RaceClassification,
  RaceClassificationBody,
  RaceSummary,
} from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import { toRaceClassification, toRaceSummary } from './race-results.mapper'
import type { RaceHeader, RaceResultsRepository } from './race-results.port'
import { scoreEntries } from './race-results.scoring'

export type RaceResultsService = {
  readonly listSeason: (year: number) => Promise<readonly RaceSummary[]>
  readonly getClassification: (raceId: string) => Promise<RaceClassification>
  readonly listEligibleDrivers: (raceId: string) => Promise<readonly EligibleDriver[]>
  readonly saveClassification: (
    raceId: string,
    body: RaceClassificationBody,
  ) => Promise<RaceClassification>
}

export type RaceResultsServiceDeps = {
  readonly repository: RaceResultsRepository
  readonly clock: () => Date
}

const findOrFail = async (repository: RaceResultsRepository, id: string): Promise<RaceHeader> => {
  const race = await repository.findRace(id)
  if (race === null) {
    throw new AppError('RACE_NOT_FOUND')
  }
  return race
}

export const createRaceResultsService = ({
  repository,
  clock,
}: RaceResultsServiceDeps): RaceResultsService => {
  const getClassification = async (raceId: string): Promise<RaceClassification> => {
    const race = await findOrFail(repository, raceId)
    return toRaceClassification(race, await repository.findClassification(raceId))
  }
  return {
    listSeason: async (year) => (await repository.listSeason(year)).map(toRaceSummary),
    getClassification,
    listEligibleDrivers: async (raceId) =>
      repository.listCategoryDrivers((await findOrFail(repository, raceId)).categoryId),
    saveClassification: async (raceId, body) => {
      const race = await findOrFail(repository, raceId)
      if (race.date.getTime() > clock().getTime()) {
        throw new AppError('RACE_NOT_FINISHED')
      }
      const drivers = await repository.findDrivers(body.entries.map((entry) => entry.driverId))
      const entries = scoreEntries(race, body, drivers)
      const input = { raceId, expectedVersion: body.version, entries }
      const saved = await repository.replaceClassification({
        ...input,
        nextRevision: race.resultsRevision + 1,
      })
      if (!saved) {
        throw new AppError('STALE_VERSION')
      }
      return getClassification(raceId)
    },
  }
}
