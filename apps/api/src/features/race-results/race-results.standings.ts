import type { DriverStanding } from '@fia/shared/contracts'
import type { SeasonResultRow } from './race-results.port'

export type { SeasonResultRow } from './race-results.port'

type Tally = Omit<DriverStanding, 'position'>

const addResult = (tally: Tally | undefined, row: SeasonResultRow): Tally => ({
  driverId: row.driverId,
  driverCode: row.driverCode,
  driverName: row.driverName,
  teamName: row.teamName,
  points: (tally?.points ?? 0) + row.points,
  wins: (tally?.wins ?? 0) + (row.position === 1 ? 1 : 0),
})

const byPointsThenWins = (a: Tally, b: Tally): number =>
  b.points - a.points || b.wins - a.wins || a.driverName.localeCompare(b.driverName)

export const buildStandings = (rows: readonly SeasonResultRow[]): readonly DriverStanding[] => {
  const tallies = new Map<string, Tally>()
  for (const row of rows) {
    tallies.set(row.driverId, addResult(tallies.get(row.driverId), row))
  }
  return [...tallies.values()]
    .sort(byPointsThenWins)
    .map((tally, index) => ({ position: index + 1, ...tally }))
}
