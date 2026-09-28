import { describe, expect, it } from 'vitest'
import { buildStandings, type SeasonResultRow } from './race-results.standings'

const row = (code: string, position: number, points: number): SeasonResultRow => ({
  driverId: `id-${code}`,
  driverCode: code,
  driverName: `Piloto ${code}`,
  teamName: `Equipo ${code}`,
  position,
  points,
})

describe('campeonato de pilotos', () => {
  it('suma puntos y victorias por piloto y ordena de mayor a menor', () => {
    const standings = buildStandings([
      row('VER', 1, 25),
      row('NOR', 2, 18),
      row('NOR', 1, 25),
      row('VER', 3, 15),
      row('LEC', 1, 8),
    ])
    expect(standings.map((s) => [s.position, s.driverCode, s.points, s.wins])).toEqual([
      [1, 'NOR', 43, 1],
      [2, 'VER', 40, 1],
      [3, 'LEC', 8, 1],
    ])
  })

  it('desempata por victorias y después por nombre', () => {
    const standings = buildStandings([row('BBB', 2, 18), row('AAA', 1, 18), row('CCC', 2, 18)])
    expect(standings.map((s) => s.driverCode)).toEqual(['AAA', 'BBB', 'CCC'])
  })

  it('una temporada sin resultados no tiene campeonato', () => {
    expect(buildStandings([])).toEqual([])
  })
})
