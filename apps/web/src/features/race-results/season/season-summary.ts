import type { DriverStanding, RaceSummary } from '@fia/shared/contracts'

export const STANDINGS_PREVIEW_SIZE = 8

export type TeamPoints = {
  readonly teamName: string
  readonly points: number
}

export const pointsByTeam = (
  rows: readonly { readonly teamName: string; readonly points: number }[],
): readonly TeamPoints[] => {
  const totals = new Map<string, number>()
  for (const row of rows) {
    totals.set(row.teamName, (totals.get(row.teamName) ?? 0) + row.points)
  }
  return [...totals]
    .map(([teamName, points]) => ({ teamName, points }))
    .sort((a, b) => b.points - a.points || a.teamName.localeCompare(b.teamName))
}

export const visibleStandings = (
  standings: readonly DriverStanding[],
  expanded: boolean,
): readonly DriverStanding[] => (expanded ? standings : standings.slice(0, STANDINGS_PREVIEW_SIZE))

export const racesWithResults = (races: readonly RaceSummary[]): number =>
  races.filter((race) => race.winnerName !== null).length

export const lastWinner = (races: readonly RaceSummary[]): RaceSummary | null =>
  races.findLast((race) => race.winnerName !== null) ?? null

export const shareOf = (points: number, total: number): number =>
  total === 0 ? 0 : Math.round((points / total) * 1000) / 10

const GENERIC_WORDS = new Set([
  'circuit',
  'circuito',
  'international',
  'internacional',
  'autodromo',
  'autódromo',
  'de',
  'del',
  'of',
  'the',
])

export const circuitWatermark = (circuitName: string): string =>
  circuitName
    .split(/\s+/)
    .filter((word) => !GENERIC_WORDS.has(word.toLowerCase()))
    .reduce((longest, word) => (word.length > longest.length ? word : longest), '')
