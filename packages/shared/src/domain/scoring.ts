export const RACE_TYPES = ['grand_prix', 'sprint'] as const

export type RaceType = (typeof RACE_TYPES)[number]

export const POINTS_BY_RACE_TYPE: Readonly<Record<RaceType, readonly number[]>> = {
  grand_prix: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1],
  sprint: [8, 7, 6, 5, 4, 3, 2, 1],
}

export const MAX_POINTS_PER_RACE = 25

export const pointsFor = (type: RaceType, position: number): number =>
  POINTS_BY_RACE_TYPE[type][position - 1] ?? 0
