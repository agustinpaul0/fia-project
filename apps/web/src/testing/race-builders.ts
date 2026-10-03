import type {
  ClassifiedResult,
  DriverStanding,
  EligibleDriver,
  RaceClassification,
  RaceSummary,
} from '@fia/shared/contracts'

export const RACE_ID = '00000000-0000-4000-8000-000000000900'

export const aRaceSummary = (overrides: Partial<RaceSummary> = {}): RaceSummary => ({
  id: RACE_ID,
  name: 'Gran Premio de Mónaco 2025',
  type: 'grand_prix',
  round: 2,
  date: '2025-05-25T13:00:00.000Z',
  seasonYear: 2025,
  categoryCode: 'F1',
  circuitName: 'Circuit de Monaco',
  version: 3,
  resultsRevision: 1,
  winnerName: 'Lando Norris',
  ...overrides,
})

export const anEligibleDriver = (n: number): EligibleDriver => ({
  id: `00000000-0000-4000-8000-${String(100 + n).padStart(12, '0')}`,
  code: ['NOR', 'LEC', 'PIA', 'VER', 'HAM'][n - 1] ?? `D${n}X`,
  name: `Piloto ${n}`,
  teamName: `Escudería ${n}`,
})

export const aResult = (n: number, points: number): ClassifiedResult => {
  const driver = anEligibleDriver(n)
  return {
    position: n,
    driverId: driver.id,
    driverCode: driver.code,
    driverName: driver.name,
    teamId: `00000000-0000-4000-8000-${String(200 + n).padStart(12, '0')}`,
    teamName: driver.teamName,
    points,
  }
}

export const aClassification = (
  overrides: Partial<RaceClassification> = {},
): RaceClassification => ({
  race: aRaceSummary(),
  results: [aResult(1, 25), aResult(2, 18)],
  ...overrides,
})

export const aDriverStanding = (
  n: number,
  overrides: Partial<DriverStanding> = {},
): DriverStanding => ({
  position: n,
  driverId: `00000000-0000-4000-8000-${String(300 + n).padStart(12, '0')}`,
  driverCode: `P${String(n).padStart(2, '0')}`,
  driverName: `Piloto ${n}`,
  teamName: `Escudería ${Math.ceil(n / 2)}`,
  points: Math.max(0, 100 - n * 5),
  wins: n === 1 ? 2 : 0,
  ...overrides,
})
