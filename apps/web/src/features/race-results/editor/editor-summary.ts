import type { RaceType } from '@fia/shared/domain'
import { pointsFor } from '@fia/shared/domain'

const PODIUM_LABELS: readonly string[] = ['Piloto ganador', 'Segundo lugar', 'Tercer lugar']

export const positionLabel = (position: number): string =>
  PODIUM_LABELS[position - 1] ?? `Clasificado ${position}°`

export const pointsLabel = (points: number): string => `${points} ${points === 1 ? 'pt' : 'pts'}`

export const totalAssigned = (type: RaceType, positions: number): number =>
  Array.from({ length: positions }, (_, index) => pointsFor(type, index + 1)).reduce(
    (sum, points) => sum + points,
    0,
  )
