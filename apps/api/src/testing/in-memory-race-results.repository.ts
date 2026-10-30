import type { RaceListQuery, UpdateRaceBody } from '@fia/shared/contracts'
import type * as P from '../features/race-results/race-results.port'
import type { TestDriver } from './race-builders'

const inSeason =
  (query: RaceListQuery) =>
  (race: P.RaceHeader): boolean =>
    race.seasonYear === query.season &&
    (query.category === undefined || race.categoryCode === query.category)

export type InMemoryRaceResults = P.RaceResultsRepository & {
  readonly races: Map<string, P.RaceHeader>
  readonly classifications: Map<string, readonly P.ClassificationRow[]>
}

const toRow = (entry: P.ScoredEntry, driver: TestDriver | undefined): P.ClassificationRow => ({
  ...entry,
  driverCode: driver?.code ?? '???',
  driverName: driver?.name ?? 'Desconocido',
  teamName: driver?.teamName ?? 'Desconocida',
})

type MutationInput = {
  readonly id: string
  readonly version: number
  readonly userId: string
  readonly patch: Partial<P.RaceHeader>
}

const applyRaceMutation = (races: Map<string, P.RaceHeader>, input: MutationInput): boolean => {
  const race = races.get(input.id)
  if (!race || race.version !== input.version) {
    return false
  }
  races.set(input.id, {
    ...race,
    ...input.patch,
    updatedByUserId: input.userId,
    version: input.version + 1,
  })
  return true
}

const toPatch = (race: P.RaceHeader, body: UpdateRaceBody): Partial<P.RaceHeader> => ({
  name: body.name ?? race.name,
  date: body.date ? new Date(body.date) : race.date,
  type: body.type ?? race.type,
  status: 'modified',
})

export const createInMemoryRaceResults = (
  raceList: readonly P.RaceHeader[],
  driverList: readonly TestDriver[],
): InMemoryRaceResults => {
  const races = new Map(raceList.map((race) => [race.id, race]))
  const classifications = new Map<string, readonly P.ClassificationRow[]>()
  const drivers = new Map(driverList.map((driver) => [driver.id, driver]))
  return {
    races,
    classifications,
    listSeason: async (query) => [...races.values()].filter(inSeason(query)),
    findRace: async (id) => races.get(id) ?? null,
    findClassification: async (raceId) => classifications.get(raceId) ?? [],
    findDrivers: async (ids) => ids.flatMap((id) => drivers.get(id) ?? []),
    listCategoryDrivers: async (catId) =>
      driverList
        .filter((d) => d.categoryId === catId)
        .map(({ id, code, name, teamName }) => ({ id, code, name, teamName })),
    listSeasonResults: async (query) =>
      [...races.values()]
        .filter(inSeason(query))
        .flatMap((race) => classifications.get(race.id) ?? []),
    replaceClassification: async ({
      raceId: id,
      expectedVersion: version,
      nextRevision,
      entries,
    }) => {
      const rows = entries.map((e) => toRow(e, drivers.get(e.driverId)))
      const patch = { resultsRevision: nextRevision, winnerName: rows[0]?.driverName ?? null }
      const ok = applyRaceMutation(races, { id, version, userId: 'sys', patch })
      if (ok) {
        classifications.set(id, rows)
      }
      return ok
    },
    updateRace: async (id, body, userId) => {
      const r = races.get(id)
      return r
        ? applyRaceMutation(races, { id, version: body.version, userId, patch: toPatch(r, body) })
        : false
    },
    cancelRace: async (id, version, userId) =>
      applyRaceMutation(races, { id, version, userId, patch: { status: 'cancelled' } }),
  }
}
