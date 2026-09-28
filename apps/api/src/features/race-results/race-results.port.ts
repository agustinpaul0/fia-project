import type { RaceType } from '@fia/shared/domain'

export type RaceHeader = {
  readonly id: string
  readonly name: string
  readonly type: RaceType
  readonly round: number
  readonly date: Date
  readonly seasonYear: number
  readonly categoryId: string
  readonly categoryCode: string
  readonly circuitName: string
  readonly version: number
  readonly resultsRevision: number
  readonly winnerName: string | null
}

export type ClassificationRow = {
  readonly position: number
  readonly driverId: string
  readonly driverCode: string
  readonly driverName: string
  readonly teamId: string
  readonly teamName: string
  readonly points: number
}

export type DriverEligibility = {
  readonly id: string
  readonly teamId: string | null
  readonly categoryId: string | null
}

export type ScoredEntry = {
  readonly driverId: string
  readonly teamId: string
  readonly position: number
  readonly points: number
}

export type ReplaceClassificationInput = {
  readonly raceId: string
  readonly expectedVersion: number
  readonly nextRevision: number
  readonly entries: readonly ScoredEntry[]
}

export type EligibleDriverRow = {
  readonly id: string
  readonly code: string
  readonly name: string
  readonly teamName: string
}

export type SeasonResultRow = {
  readonly driverId: string
  readonly driverCode: string
  readonly driverName: string
  readonly teamName: string
  readonly position: number
  readonly points: number
}

export type RaceResultsRepository = {
  readonly listSeason: (year: number) => Promise<readonly RaceHeader[]>
  readonly findRace: (id: string) => Promise<RaceHeader | null>
  readonly findClassification: (raceId: string) => Promise<readonly ClassificationRow[]>
  readonly findDrivers: (ids: readonly string[]) => Promise<readonly DriverEligibility[]>
  readonly listCategoryDrivers: (categoryId: string) => Promise<readonly EligibleDriverRow[]>
  readonly listSeasonResults: (year: number) => Promise<readonly SeasonResultRow[]>
  readonly replaceClassification: (input: ReplaceClassificationInput) => Promise<boolean>
}
