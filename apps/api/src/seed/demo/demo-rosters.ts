import type { CategoryRoster, SeedDriver } from '../base-data-entities.seed'

type Pair = readonly [string, string, string, number, string]

const pair = (teamName: string, people: readonly Pair[]): readonly SeedDriver[] =>
  people.map(([firstName, lastName, code, number, country]) => ({
    firstName,
    lastName,
    code,
    number,
    country,
    teamName,
  }))

export const DEMO_ROSTERS: readonly CategoryRoster[] = [
  {
    categoryCode: 'F2',
    teams: [
      { name: 'Invicta Racing', country: 'Reino Unido' },
      { name: 'Campos Racing', country: 'España' },
      { name: 'Hitech TGR', country: 'Reino Unido' },
    ],
    drivers: [
      ...pair('Invicta Racing', [
        ['Leonardo', 'Fornaroli', 'FOR', 2, 'Italia'],
        ['Roman', 'Staněk', 'STA', 3, 'República Checa'],
      ]),
      ...pair('Campos Racing', [
        ['Arvid', 'Lindblad', 'LIN', 5, 'Reino Unido'],
        ['Josep María', 'Martí', 'MAR', 6, 'España'],
      ]),
      ...pair('Hitech TGR', [
        ['Luke', 'Browning', 'BRO', 7, 'Reino Unido'],
        ['Dino', 'Beganovic', 'BEG', 8, 'Suecia'],
      ]),
    ],
  },
  {
    categoryCode: 'F3',
    teams: [
      { name: 'Trident', country: 'Italia' },
      { name: 'Prema Racing', country: 'Italia' },
      { name: 'ART Grand Prix', country: 'Francia' },
    ],
    drivers: [
      ...pair('Trident', [
        ['Rafael', 'Câmara', 'CAM', 21, 'Brasil'],
        ['Charlie', 'Wurz', 'WUR', 22, 'Austria'],
      ]),
      ...pair('Prema Racing', [
        ['Ugo', 'Ugochukwu', 'UGO', 23, 'Estados Unidos'],
        ['Brando', 'Badoer', 'BAD', 24, 'Italia'],
      ]),
      ...pair('ART Grand Prix', [
        ['Laurens', 'van Hoepen', 'HOE', 25, 'Países Bajos'],
        ['Tim', 'Tramnitz', 'TRA', 26, 'Alemania'],
      ]),
    ],
  },
  {
    categoryCode: 'F1A',
    teams: [
      { name: 'MP Motorsport', country: 'Países Bajos' },
      { name: 'Rodin Motorsport', country: 'Nueva Zelanda' },
      { name: 'Hitech Pulse-Eight', country: 'Reino Unido' },
    ],
    drivers: [
      ...pair('MP Motorsport', [
        ['Maya', 'Weug', 'WEU', 31, 'Países Bajos'],
        ['Alba', 'Larsen', 'LAR', 32, 'Dinamarca'],
      ]),
      ...pair('Rodin Motorsport', [
        ['Chloe', 'Chambers', 'CHA', 33, 'Estados Unidos'],
        ['Lia', 'Block', 'BLO', 34, 'Estados Unidos'],
      ]),
      ...pair('Hitech Pulse-Eight', [
        ['Doriane', 'Pin', 'PIN', 35, 'Francia'],
        ['Nina', 'Gademan', 'GAD', 36, 'Países Bajos'],
      ]),
    ],
  },
]
