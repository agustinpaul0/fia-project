export interface SeedRaceDefinition {
  year: number
  round: number
  name: string
  circuitName: string
  date: string
  results: readonly string[]
}

export const F1_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1] as const

export const SEED_RACES: readonly SeedRaceDefinition[] = [
  {
    year: 2024,
    round: 1,
    name: 'Gran Premio de Bahréin 2024',
    circuitName: 'Bahrain International Circuit',
    date: '2024-03-02T15:00:00.000Z',
    results: ['VER', 'PER', 'SAI', 'LEC', 'RUS', 'NOR', 'HAM', 'PIA', 'ALO', 'STR'],
  },
  {
    year: 2024,
    round: 2,
    name: 'Gran Premio de Mónaco 2024',
    circuitName: 'Circuit de Monaco',
    date: '2024-05-26T13:00:00.000Z',
    results: ['LEC', 'PIA', 'SAI', 'NOR', 'RUS', 'VER', 'HAM', 'PER', 'ALO', 'STR'],
  },
  {
    year: 2024,
    round: 3,
    name: 'Gran Premio de Gran Bretaña 2024',
    circuitName: 'Silverstone Circuit',
    date: '2024-07-07T14:00:00.000Z',
    results: ['HAM', 'VER', 'NOR', 'PIA', 'SAI', 'LEC', 'RUS', 'PER', 'ALO', 'STR'],
  },
  {
    year: 2025,
    round: 1,
    name: 'Gran Premio de Bahréin 2025',
    circuitName: 'Bahrain International Circuit',
    date: '2025-03-02T15:00:00.000Z',
    results: ['VER', 'NOR', 'LEC', 'PIA', 'HAM', 'RUS', 'SAI', 'ALO', 'PER', 'STR'],
  },
  {
    year: 2025,
    round: 2,
    name: 'Gran Premio de Mónaco 2025',
    circuitName: 'Circuit de Monaco',
    date: '2025-05-25T13:00:00.000Z',
    results: ['NOR', 'LEC', 'PIA', 'VER', 'HAM', 'RUS', 'SAI', 'ALO', 'STR', 'PER'],
  },
  {
    year: 2025,
    round: 3,
    name: 'Gran Premio de Gran Bretaña 2025',
    circuitName: 'Silverstone Circuit',
    date: '2025-07-06T14:00:00.000Z',
    results: ['NOR', 'HAM', 'VER', 'PIA', 'LEC', 'RUS', 'SAI', 'ALO', 'PER', 'STR'],
  },
]
