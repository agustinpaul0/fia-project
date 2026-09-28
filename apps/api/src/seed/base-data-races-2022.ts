import { CIRCUIT, type SeedRaceDefinition, seedRace } from './seed-race-helper'

export const SEED_RACES_2022: readonly SeedRaceDefinition[] = [
  seedRace({
    year: 2022,
    round: 1,
    country: 'Bahréin',
    circuitName: CIRCUIT.bahrain,
    date: '2022-03-20T15:00:00.000Z',
    order: 'LEC SAI HAM RUS NOR ALO PER VER STR PIA',
  }),
  seedRace({
    year: 2022,
    round: 2,
    country: 'Mónaco',
    circuitName: CIRCUIT.monaco,
    date: '2022-05-29T13:00:00.000Z',
    order: 'PER SAI VER LEC RUS NOR ALO HAM STR PIA',
  }),
  seedRace({
    year: 2022,
    round: 3,
    country: 'Gran Bretaña',
    circuitName: CIRCUIT.silverstone,
    date: '2022-07-03T14:00:00.000Z',
    order: 'SAI PER HAM LEC ALO NOR VER STR RUS PIA',
  }),
  seedRace({
    year: 2022,
    round: 4,
    country: 'Brasil',
    circuitName: CIRCUIT.interlagos,
    date: '2022-11-12T19:30:00.000Z',
    order: 'RUS VER HAM SAI PER LEC NOR ALO STR PIA',
    type: 'sprint',
  }),
  seedRace({
    year: 2022,
    round: 4,
    country: 'Brasil',
    circuitName: CIRCUIT.interlagos,
    date: '2022-11-13T18:00:00.000Z',
    order: 'RUS HAM SAI LEC ALO VER PER STR NOR PIA',
  }),
]
