import type {
  ClassificationRow,
  RaceHeader,
  RaceResultsRepository,
  ScoredEntry,
} from '../features/race-results/race-results.port'
import type { TestDriver } from './race-builders'

export type InMemoryRaceResults = RaceResultsRepository & {
  readonly races: Map<string, RaceHeader>
  readonly classifications: Map<string, readonly ClassificationRow[]>
}

const toRow = (entry: ScoredEntry, driver: TestDriver | undefined): ClassificationRow => ({
  ...entry,
  driverCode: driver?.code ?? '???',
  driverName: driver?.name ?? 'Desconocido',
  teamName: driver?.teamName ?? 'Desconocida',
})

export const createInMemoryRaceResults = (
  raceList: readonly RaceHeader[],
  driverList: readonly TestDriver[],
): InMemoryRaceResults => {
  const races = new Map(raceList.map((race) => [race.id, race]))
  const classifications = new Map<string, readonly ClassificationRow[]>()
  const drivers = new Map(driverList.map((driver) => [driver.id, driver]))
  return {
    races,
    classifications,
    listSeason: async (year) => [...races.values()].filter((race) => race.seasonYear === year),
    findRace: async (id) => races.get(id) ?? null,
    findClassification: async (raceId) => classifications.get(raceId) ?? [],
    findDrivers: async (ids) =>
      ids.flatMap((id) => {
        const driver = drivers.get(id)
        return driver === undefined ? [] : [driver]
      }),
    listCategoryDrivers: async (categoryId) =>
      driverList
        .filter((driver) => driver.categoryId === categoryId)
        .map(({ id, code, name, teamName }) => ({ id, code, name, teamName })),
    listSeasonResults: async (year) =>
      [...races.values()]
        .filter((race) => race.seasonYear === year)
        .flatMap((race) => classifications.get(race.id) ?? []),
    replaceClassification: async ({ raceId, expectedVersion, nextRevision, entries }) => {
      const race = races.get(raceId)
      if (race === undefined || race.version !== expectedVersion) {
        return false
      }
      const rows = entries.map((entry) => toRow(entry, drivers.get(entry.driverId)))
      classifications.set(raceId, rows)
      const winner = rows[0]?.driverName ?? null
      races.set(raceId, {
        ...race,
        version: expectedVersion + 1,
        resultsRevision: nextRevision,
        winnerName: winner,
      })
      return true
    },
  }
}
