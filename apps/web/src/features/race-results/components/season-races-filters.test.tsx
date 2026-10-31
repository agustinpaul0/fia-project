import { fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { aRaceSummary } from '@/testing/race-builders'
import { renderWithRouter } from '@/testing/render-with-router'
import { SeasonRaces } from './season-races-panel'
import { filterStandings } from './standings-panel'

const NOW = new Date('2026-06-01T12:00:00Z')
const id = (n: number) => `00000000-0000-4000-8000-00000000000${n}`
const PAST = aRaceSummary({
  id: id(1),
  name: 'GP de Bahrein',
  circuitName: 'Sakhir',
  date: '2026-03-01T15:00:00.000Z',
})
const NEXT = aRaceSummary({
  id: id(2),
  name: 'GP de Canadá',
  circuitName: 'Montreal',
  date: '2026-06-08T18:00:00.000Z',
})
const LATE = aRaceSummary({
  id: id(3),
  name: 'GP de Abu Dhabi',
  circuitName: 'Yas Marina',
  date: '2026-12-06T13:00:00.000Z',
})

const renderCalendar = async () => {
  mockFetchRoutes({ 'GET /races?season=2026': () => jsonResponse([PAST, LATE, NEXT]) })
  renderWithRouter(
    <SeasonRaces scope={{ season: 2026, category: null }} target="public" now={NOW} />,
  )
  await screen.findByText('GP de Canadá')
}

const names = (): readonly string[] =>
  screen.getAllByText(/^GP de /).map((el) => el.textContent ?? '')

describe('filtros del calendario y resultados (US-3)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('ordena por relevancia: el evento más cercano primero', async () => {
    await renderCalendar()
    expect(names()).toEqual(['GP de Canadá', 'GP de Bahrein', 'GP de Abu Dhabi'])
  })

  it('combina evento y rango de fechas, muestra "Sin resultados" y limpia con un botón', async () => {
    await renderCalendar()
    fireEvent.change(screen.getByLabelText('Evento:'), { target: { value: 'yas' } })
    expect(names()).toEqual(['GP de Abu Dhabi'])
    fireEvent.change(screen.getByLabelText('Hasta:'), { target: { value: '2026-07-01' } })
    expect(screen.getByText('Sin resultados.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }))
    expect(names()).toHaveLength(3)
  })

  it('el campeonato se filtra por piloto o escudería', () => {
    const standings = [
      {
        position: 1,
        driverId: id(4),
        driverCode: 'NOR',
        driverName: 'Lando Norris',
        teamName: 'McLaren',
        points: 25,
        wins: 1,
      },
      {
        position: 2,
        driverId: id(5),
        driverCode: 'LEC',
        driverName: 'Charles Leclerc',
        teamName: 'Ferrari',
        points: 18,
        wins: 0,
      },
    ]
    expect(filterStandings(standings, 'ferr').map((s) => s.driverCode)).toEqual(['LEC'])
    expect(filterStandings(standings, 'nor').map((s) => s.driverCode)).toEqual(['NOR'])
    expect(filterStandings(standings, '')).toHaveLength(2)
  })
})
