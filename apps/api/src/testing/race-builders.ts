import type { RaceHeader } from '../features/race-results/race-results.port'

export const F1_CATEGORY_ID = '00000000-0000-4000-8000-0000000000c1'
export const F2_CATEGORY_ID = '00000000-0000-4000-8000-0000000000c2'
export const PAST_RACE_DATE = new Date('2025-03-16T05:00:00.000Z')
export const TEST_NOW = new Date('2026-09-28T12:00:00.000Z')

export type TestDriver = {
  readonly id: string
  readonly code: string
  readonly name: string
  readonly teamId: string | null
  readonly teamName: string
  readonly categoryId: string | null
}

const uuid = (n: number): string => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`

export const aRaceHeader = (overrides: Partial<RaceHeader> = {}): RaceHeader => ({
  id: uuid(900),
  name: 'Gran Premio de Australia 2025',
  type: 'grand_prix',
  round: 1,
  date: PAST_RACE_DATE,
  seasonYear: 2025,
  categoryId: F1_CATEGORY_ID,
  categoryCode: 'F1',
  circuitName: 'Albert Park',
  version: 1,
  resultsRevision: 0,
  winnerName: null,
  ...overrides,
})

export const aDriver = (n: number, overrides: Partial<TestDriver> = {}): TestDriver => ({
  id: uuid(100 + n),
  code: `D${String.fromCharCode(64 + n)}${String.fromCharCode(64 + n)}`,
  name: `Piloto ${n}`,
  teamId: uuid(200 + Math.ceil(n / 2)),
  teamName: `Escudería ${Math.ceil(n / 2)}`,
  categoryId: F1_CATEGORY_ID,
  ...overrides,
})

export const someDrivers = (count: number): readonly TestDriver[] =>
  Array.from({ length: count }, (_, i) => aDriver(i + 1))

export const classificationBody = (
  driverList: readonly TestDriver[],
  version = 1,
): { version: number; entries: { driverId: string }[] } => ({
  version,
  entries: driverList.map((driver) => ({ driverId: driver.id })),
})
