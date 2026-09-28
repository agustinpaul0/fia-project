import type { RaceType } from '@fia/shared/domain'

export type SeedRaceDefinition = {
  readonly year: number
  readonly round: number
  readonly type: RaceType
  readonly name: string
  readonly circuitName: string
  readonly date: string
  readonly results: readonly string[]
}

export type SeedRaceSpec = {
  readonly year: number
  readonly round: number
  readonly country: string
  readonly circuitName: string
  readonly date: string
  readonly order: string
  readonly type?: RaceType
}

export const CIRCUIT = {
  bahrain: 'Bahrain International Circuit',
  monaco: 'Circuit de Monaco',
  silverstone: 'Silverstone Circuit',
  spa: 'Circuit de Spa-Francorchamps',
  monza: 'Autodromo Nazionale Monza',
  interlagos: 'Autódromo José Carlos Pace',
} as const

export const seedRace = ({ type = 'grand_prix', ...spec }: SeedRaceSpec): SeedRaceDefinition => ({
  year: spec.year,
  round: spec.round,
  type,
  name: `${type === 'sprint' ? 'Sprint' : 'Gran Premio'} de ${spec.country} ${spec.year}`,
  circuitName: spec.circuitName,
  date: spec.date,
  results: spec.order.split(' '),
})
