import { CIRCUIT, type SeedRaceDefinition, seedRace } from './seed-race-helper'

export const SEED_RACES_2023: readonly SeedRaceDefinition[] = [
  seedRace({
    year: 2023,
    round: 1,
    country: 'Bahréin',
    circuitName: CIRCUIT.bahrain,
    date: '2023-03-05T15:00:00.000Z',
    order: 'VER PER ALO SAI HAM STR RUS NOR LEC PIA',
  }),
  seedRace({
    year: 2023,
    round: 2,
    country: 'Mónaco',
    circuitName: CIRCUIT.monaco,
    date: '2023-05-28T13:00:00.000Z',
    order: 'VER ALO HAM RUS LEC SAI NOR PIA PER STR',
  }),
  seedRace({
    year: 2023,
    round: 3,
    country: 'Gran Bretaña',
    circuitName: CIRCUIT.silverstone,
    date: '2023-07-09T14:00:00.000Z',
    order: 'VER NOR HAM PIA RUS PER ALO SAI LEC STR',
  }),
  seedRace({
    year: 2023,
    round: 4,
    country: 'Bélgica',
    circuitName: CIRCUIT.spa,
    date: '2023-07-29T15:05:00.000Z',
    order: 'VER PIA HAM SAI LEC NOR RUS ALO STR PER',
    type: 'sprint',
  }),
  seedRace({
    year: 2023,
    round: 4,
    country: 'Bélgica',
    circuitName: CIRCUIT.spa,
    date: '2023-07-30T13:00:00.000Z',
    order: 'VER PER LEC HAM ALO RUS NOR STR SAI PIA',
  }),
]
