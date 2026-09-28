import type { RaceClassification, RaceSummary } from '@fia/shared/contracts'
import type { ClassificationRow, RaceHeader } from './race-results.port'

export const toRaceSummary = (race: RaceHeader): RaceSummary => ({
  id: race.id,
  name: race.name,
  type: race.type,
  round: race.round,
  date: race.date.toISOString(),
  seasonYear: race.seasonYear,
  categoryCode: race.categoryCode,
  circuitName: race.circuitName,
  version: race.version,
  resultsRevision: race.resultsRevision,
  winnerName: race.winnerName,
})

export const toRaceClassification = (
  race: RaceHeader,
  results: readonly ClassificationRow[],
): RaceClassification => ({ race: toRaceSummary(race), results: [...results] })
