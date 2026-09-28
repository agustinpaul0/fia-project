import { CIRCUIT, type SeedRaceDefinition, seedRace } from './seed-race-helper'

export const SEED_RACES_2021: readonly SeedRaceDefinition[] = [
  seedRace({
    year: 2021,
    round: 1,
    country: 'Bahréin',
    circuitName: CIRCUIT.bahrain,
    date: '2021-03-28T15:00:00.000Z',
    order: 'HAM VER NOR PER LEC RUS SAI ALO STR PIA',
  }),
  seedRace({
    year: 2021,
    round: 2,
    country: 'Mónaco',
    circuitName: CIRCUIT.monaco,
    date: '2021-05-23T13:00:00.000Z',
    order: 'VER SAI NOR PER LEC HAM RUS ALO STR PIA',
  }),
  seedRace({
    year: 2021,
    round: 3,
    country: 'Gran Bretaña',
    circuitName: CIRCUIT.silverstone,
    date: '2021-07-17T15:30:00.000Z',
    order: 'VER HAM NOR LEC PER SAI ALO RUS STR PIA',
    type: 'sprint',
  }),
  seedRace({
    year: 2021,
    round: 3,
    country: 'Gran Bretaña',
    circuitName: CIRCUIT.silverstone,
    date: '2021-07-18T14:00:00.000Z',
    order: 'HAM LEC NOR SAI RUS ALO STR PER VER PIA',
  }),
  seedRace({
    year: 2021,
    round: 4,
    country: 'Italia',
    circuitName: CIRCUIT.monza,
    date: '2021-09-12T13:00:00.000Z',
    order: 'NOR PER LEC SAI RUS ALO STR HAM VER PIA',
  }),
]
