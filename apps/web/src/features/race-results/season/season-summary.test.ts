import { describe, expect, it } from 'vitest'
import { aDriverStanding, aRaceSummary } from '@/testing/race-builders'
import {
  circuitWatermark,
  lastWinner,
  pointsByTeam,
  racesWithResults,
  STANDINGS_PREVIEW_SIZE,
  shareOf,
  visibleStandings,
} from './season-summary'

describe('resumen de la temporada', () => {
  it('suma los puntos por escudería y ordena de mayor a menor', () => {
    const rows = [
      { teamName: 'McLaren', points: 25 },
      { teamName: 'Ferrari', points: 18 },
      { teamName: 'McLaren', points: 15 },
      { teamName: 'Alpine', points: 18 },
    ]
    expect(pointsByTeam(rows)).toEqual([
      { teamName: 'McLaren', points: 40 },
      { teamName: 'Alpine', points: 18 },
      { teamName: 'Ferrari', points: 18 },
    ])
    expect(pointsByTeam([])).toEqual([])
  })

  it('muestra los primeros 8 del campeonato salvo que se pida la tabla completa', () => {
    const standings = Array.from({ length: 10 }, (_, i) => aDriverStanding(i + 1))
    expect(visibleStandings(standings, false)).toHaveLength(STANDINGS_PREVIEW_SIZE)
    expect(visibleStandings(standings, false)[7]).toBe(standings[7])
    expect(visibleStandings(standings, true)).toHaveLength(10)
  })

  it('cuenta las carreras con resultado y encuentra al último ganador', () => {
    const first = aRaceSummary({ id: 'a', winnerName: 'Oscar Piastri' })
    const second = aRaceSummary({ id: 'b', winnerName: 'Lando Norris' })
    const pending = aRaceSummary({ id: 'c', winnerName: null })
    expect(racesWithResults([first, second, pending])).toBe(2)
    expect(lastWinner([first, second, pending])).toBe(second)
    expect(lastWinner([pending])).toBeNull()
  })

  it('calcula el porcentaje de puntos con un decimal', () => {
    expect(shareOf(33, 101)).toBe(32.7)
    expect(shareOf(25, 25)).toBe(100)
    expect(shareOf(0, 0)).toBe(0)
  })

  it('elige la palabra distintiva del circuito para la marca de agua', () => {
    expect(circuitWatermark('Circuit de Monaco')).toBe('Monaco')
    expect(circuitWatermark('Silverstone Circuit')).toBe('Silverstone')
    expect(circuitWatermark('Bahrain International Circuit')).toBe('Bahrain')
    expect(circuitWatermark('Circuit')).toBe('')
  })
})
