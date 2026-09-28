import { SEED_RACES_2021 } from './base-data-races-2021'
import { SEED_RACES_2022 } from './base-data-races-2022'
import { SEED_RACES_2023 } from './base-data-races-2023'
import { SEED_RACES_2024 } from './base-data-races-2024'
import { SEED_RACES_2025 } from './base-data-races-2025'
import { CIRCUIT, type SeedRaceDefinition, seedRace } from './seed-race-helper'

export type { SeedRaceDefinition } from './seed-race-helper'

const SEED_RACES_2026: readonly SeedRaceDefinition[] = [
  seedRace({
    year: 2026,
    round: 1,
    country: 'Bahréin',
    circuitName: CIRCUIT.bahrain,
    date: '2026-12-06T15:00:00.000Z',
    order: '',
  }),
]

export const SEED_RACES: readonly SeedRaceDefinition[] = [
  ...SEED_RACES_2021,
  ...SEED_RACES_2022,
  ...SEED_RACES_2023,
  ...SEED_RACES_2024,
  ...SEED_RACES_2025,
  ...SEED_RACES_2026,
]
