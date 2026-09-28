import { CIRCUIT, type SeedRaceDefinition, seedRace } from './seed-race-helper'

export const SEED_RACES_2025: readonly SeedRaceDefinition[] = [
  seedRace({
    year: 2025,
    round: 1,
    country: 'Bahréin',
    circuitName: CIRCUIT.bahrain,
    date: '2025-04-13T15:00:00.000Z',
    order: 'PIA RUS NOR LEC HAM VER SAI ALO PER STR',
  }),
  seedRace({
    year: 2025,
    round: 2,
    country: 'Mónaco',
    circuitName: CIRCUIT.monaco,
    date: '2025-05-25T13:00:00.000Z',
    order: 'NOR LEC PIA VER HAM RUS SAI ALO STR PER',
  }),
  seedRace({
    year: 2025,
    round: 3,
    country: 'Gran Bretaña',
    circuitName: CIRCUIT.silverstone,
    date: '2025-07-06T14:00:00.000Z',
    order: 'NOR PIA HAM VER LEC RUS SAI ALO STR PER',
  }),
  seedRace({
    year: 2025,
    round: 4,
    country: 'Bélgica',
    circuitName: CIRCUIT.spa,
    date: '2025-07-26T10:00:00.000Z',
    order: 'VER PIA NOR LEC RUS HAM SAI ALO STR PER',
    type: 'sprint',
  }),
  seedRace({
    year: 2025,
    round: 4,
    country: 'Bélgica',
    circuitName: CIRCUIT.spa,
    date: '2025-07-27T13:00:00.000Z',
    order: 'PIA NOR LEC VER RUS HAM SAI ALO STR PER',
  }),
]
