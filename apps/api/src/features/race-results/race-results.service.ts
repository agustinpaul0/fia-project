import type * as C from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import { toRaceClassification, toRaceSummary } from './race-results.mapper'
import type { RaceHeader, RaceResultsRepository } from './race-results.port'
import { scoreEntries } from './race-results.scoring'
import { buildStandings } from './race-results.standings'

export type RaceResultsService = {
  readonly listSeason: (query: C.RaceListQuery) => Promise<readonly C.RaceSummary[]>
  readonly seasonStandings: (query: C.RaceListQuery) => Promise<readonly C.DriverStanding[]>
  readonly getClassification: (raceId: string) => Promise<C.RaceClassification>
  readonly listEligibleDrivers: (raceId: string) => Promise<readonly C.EligibleDriver[]>
  readonly saveClassification: (
    raceId: string,
    body: C.RaceClassificationBody,
  ) => Promise<C.RaceClassification>
  readonly updateRace: (
    raceId: string,
    body: C.UpdateRaceBody,
    userId: string,
  ) => Promise<C.RaceSummary>
  readonly cancelRace: (raceId: string, version: number, userId: string) => Promise<C.RaceSummary>
}

export type RaceResultsServiceDeps = {
  readonly repository: RaceResultsRepository
  readonly clock: () => Date
}

const findOrFail = async (repo: RaceResultsRepository, id: string): Promise<RaceHeader> => {
  const race = await repo.findRace(id)
  if (!race) {
    throw new AppError('RACE_NOT_FOUND')
  }
  return race
}

const findActiveOrFail = async (repo: RaceResultsRepository, id: string): Promise<RaceHeader> => {
  const race = await findOrFail(repo, id)
  if (race.status === 'cancelled') {
    throw new AppError('RACE_ALREADY_CANCELLED')
  }
  return race
}

const runRaceMutation = async (
  repo: RaceResultsRepository,
  id: string,
  run: () => Promise<boolean | undefined>,
): Promise<C.RaceSummary> => {
  await findActiveOrFail(repo, id)
  if (!(await run())) {
    throw new AppError('STALE_VERSION')
  }
  return toRaceSummary(await findOrFail(repo, id))
}

export const createRaceResultsService = ({
  repository: repo,
  clock,
}: RaceResultsServiceDeps): RaceResultsService => {
  const getClassification = async (id: string): Promise<C.RaceClassification> =>
    toRaceClassification(await findOrFail(repo, id), await repo.findClassification(id))

  return {
    listSeason: async (q) => (await repo.listSeason(q)).map(toRaceSummary),
    seasonStandings: async (q) => buildStandings(await repo.listSeasonResults(q)),
    getClassification,
    listEligibleDrivers: async (id) =>
      repo.listCategoryDrivers((await findOrFail(repo, id)).categoryId),
    saveClassification: async (raceId, body) => {
      const race = await findActiveOrFail(repo, raceId)
      if (race.date.getTime() > clock().getTime()) {
        throw new AppError('RACE_NOT_FINISHED')
      }
      const drivers = await repo.findDrivers(body.entries.map((e) => e.driverId))
      const entries = scoreEntries(race, body, drivers)
      const nextRevision = race.resultsRevision + 1
      const expectedVersion = body.version
      const saved = await repo.replaceClassification({
        raceId,
        expectedVersion,
        nextRevision,
        entries,
      })
      if (!saved) {
        throw new AppError('STALE_VERSION')
      }
      return getClassification(raceId)
    },
    updateRace: (id, body, userId) =>
      runRaceMutation(repo, id, async () => repo.updateRace?.(id, body, userId)),
    cancelRace: (id, version, userId) =>
      runRaceMutation(repo, id, async () => repo.cancelRace?.(id, version, userId)),
  }
}
