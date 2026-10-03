import type { RaceType } from '@fia/shared/domain'
import { CIRCUIT, type SeedRaceDefinition, seedRace } from '../seed-race-helper'

const VENUES = [
  { country: 'Bahréin', circuitName: CIRCUIT.bahrain, month: 3 },
  { country: 'Mónaco', circuitName: CIRCUIT.monaco, month: 5 },
  { country: 'Gran Bretaña', circuitName: CIRCUIT.silverstone, month: 7 },
  { country: 'Italia', circuitName: CIRCUIT.monza, month: 9 },
] as const

export const DEMO_SEASONS = [2021, 2022, 2023, 2024, 2025] as const
const SPRINT_ROUND = 2

export const shuffledOrder = (codes: readonly string[], seed: number): readonly string[] => {
  let state = seed
  const random = (): number => {
    state = (state * 1103515245 + 12345) % 2147483648
    return state / 2147483648
  }
  return codes
    .map((code) => ({ code, key: random() }))
    .sort((a, b) => a.key - b.key)
    .map(({ code }) => code)
}

type RaceSlot = {
  readonly salt: number
  readonly year: number
  readonly round: number
  readonly type: RaceType
}

const raceFor = (
  codes: readonly string[],
  { salt, year, round, type }: RaceSlot,
): SeedRaceDefinition => {
  const venue = VENUES[round - 1] ?? VENUES[0]
  const day = type === 'sprint' ? 13 : 14
  return seedRace({
    year,
    round,
    type,
    country: venue.country,
    circuitName: venue.circuitName,
    date: `${year}-${String(venue.month).padStart(2, '0')}-${day}T14:00:00.000Z`,
    order: shuffledOrder(codes, salt + year * 100 + round * 10 + (type === 'sprint' ? 1 : 0)).join(
      ' ',
    ),
  })
}

export const saltOf = (categoryCode: string): number =>
  [...categoryCode].reduce((sum, char) => sum * 31 + char.charCodeAt(0), 7) * 977

export const demoCalendar = (
  categoryCode: string,
  codes: readonly string[],
): readonly SeedRaceDefinition[] =>
  DEMO_SEASONS.flatMap((year) =>
    VENUES.flatMap((_, index) => {
      const round = index + 1
      const salt = saltOf(categoryCode)
      const grandPrix = raceFor(codes, { salt, year, round, type: 'grand_prix' })
      const sprint = raceFor(codes, { salt, year, round, type: 'sprint' })
      return round === SPRINT_ROUND ? [sprint, grandPrix] : [grandPrix]
    }),
  )
