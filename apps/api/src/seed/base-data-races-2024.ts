import { CIRCUIT, type SeedRaceDefinition, seedRace } from './seed-race-helper'

export const SEED_RACES_2024: readonly SeedRaceDefinition[] = [
  seedRace({
    year: 2024,
    round: 1,
    country: 'Bahréin',
    circuitName: CIRCUIT.bahrain,
    date: '2024-03-02T15:00:00.000Z',
    order: 'VER PER SAI LEC RUS NOR HAM PIA ALO STR',
  }),
  seedRace({
    year: 2024,
    round: 2,
    country: 'Mónaco',
    circuitName: CIRCUIT.monaco,
    date: '2024-05-26T13:00:00.000Z',
    order: 'LEC PIA SAI NOR RUS VER HAM PER ALO STR',
  }),
  seedRace({
    year: 2024,
    round: 3,
    country: 'Gran Bretaña',
    circuitName: CIRCUIT.silverstone,
    date: '2024-07-07T14:00:00.000Z',
    order: 'HAM VER NOR PIA SAI LEC RUS PER ALO STR',
  }),
  seedRace({
    year: 2024,
    round: 4,
    country: 'Brasil',
    circuitName: CIRCUIT.interlagos,
    date: '2024-11-02T14:00:00.000Z',
    order: 'NOR PIA LEC VER SAI RUS HAM PER ALO STR',
    type: 'sprint',
  }),
  seedRace({
    year: 2024,
    round: 4,
    country: 'Brasil',
    circuitName: CIRCUIT.interlagos,
    date: '2024-11-03T15:30:00.000Z',
    order: 'VER LEC NOR RUS PIA HAM SAI ALO PER STR',
  }),
]
