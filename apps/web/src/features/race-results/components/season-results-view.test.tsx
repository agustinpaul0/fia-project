import { fireEvent, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { aCategory } from '@/testing/category-builders'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { aDriverStanding, aRaceSummary } from '@/testing/race-builders'
import { renderWithRouter } from '@/testing/render-with-router'
import { NO_RACES_MESSAGE } from './season-races-panel'
import { NO_STANDINGS_MESSAGE, SeasonResultsView } from './season-results-view'

const NOW = new Date('2026-09-28T12:00:00.000Z')
const F2 = aCategory({ id: '00000000-0000-4000-8000-000000000002', name: 'Fórmula 2', code: 'F2' })
type Spec = {
  readonly n: number
  readonly code: string
  readonly points: number
  readonly wins: number
}

const standing = ({ n, code, points, wins }: Spec) =>
  aDriverStanding(n, {
    driverCode: code,
    driverName: `Piloto ${code}`,
    teamName: `Equipo ${code}`,
    points,
    wins,
  })

describe('SeasonResultsView', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('muestra métricas, campeonato y carreras de la categoría en la última temporada completa', async () => {
    mockFetchRoutes({
      'GET /races/standings?season=2025&category=F1': () =>
        jsonResponse([
          standing({ n: 1, code: 'NOR', points: 101, wins: 3 }),
          standing({ n: 2, code: 'VER', points: 90, wins: 1 }),
        ]),
      'GET /races?season=2025&category=F1': () => jsonResponse([aRaceSummary()]),
      'GET /categories': () => jsonResponse([aCategory(), F2]),
    })
    renderWithRouter(<SeasonResultsView category="F1" now={NOW} />)
    expect(await screen.findByText('Campeonato de pilotos 2025')).toBeInTheDocument()
    const table = await screen.findByRole('table')
    const rows = within(table).getAllByRole('row')
    expect(rows[1]).toHaveTextContent('1NOR Piloto NOREquipo NOR3101 pts')
    expect(rows[2]).toHaveTextContent('2VER Piloto VEREquipo VER190 pts')
    expect(
      await screen.findByRole('link', { name: 'Gran Premio de Mónaco 2025' }),
    ).toBeInTheDocument()
    expect(screen.getByText('NOR · 101 pts')).toBeInTheDocument()
    expect(screen.getAllByText('Equipo NOR')).toHaveLength(2)
    expect(screen.getByText('R02 · Lando Norris')).toBeInTheDocument()
    expect(screen.getByText('1 de 1 con resultado')).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: 'Fórmula 2' })).toHaveAttribute(
      'href',
      '/results?category=F2',
    )
    expect(screen.getByRole('link', { name: 'Fórmula 1' })).toHaveAttribute('aria-current', 'page')
  })

  it('muestra los primeros 8 y despliega la tabla completa', async () => {
    const standings = Array.from({ length: 10 }, (_, i) =>
      standing({ n: i + 1, code: `D${i + 10}`, points: 100 - i, wins: 0 }),
    )
    mockFetchRoutes({
      'GET /races/standings?season=2025&category=F1': () => jsonResponse(standings),
      'GET /races?season=2025&category=F1': () => jsonResponse([]),
    })
    renderWithRouter(<SeasonResultsView category="F1" now={NOW} />)
    expect(await screen.findByText('Mostrando 8 de 10 pilotos')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Ver tabla completa/ }))
    expect(screen.getByText('Mostrando 10 de 10 pilotos')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Ver sólo los primeros/ }))
    expect(screen.getByText('Mostrando 8 de 10 pilotos')).toBeInTheDocument()
  })

  it('al elegir otra temporada consulta sus datos y muestra los estados vacíos', async () => {
    mockFetchRoutes({
      'GET /races/standings?season=2025&category=F2': () => jsonResponse([]),
      'GET /races?season=2025&category=F2': () => jsonResponse([]),
      'GET /races/standings?season=2026&category=F2': () => jsonResponse([]),
      'GET /races?season=2026&category=F2': () => jsonResponse([]),
    })
    renderWithRouter(<SeasonResultsView category="F2" now={NOW} />)
    fireEvent.change(await screen.findByRole('combobox'), { target: { value: '2026' } })
    expect(await screen.findByText('Campeonato de pilotos 2026')).toBeInTheDocument()
    expect(await screen.findByText(NO_STANDINGS_MESSAGE)).toBeInTheDocument()
    expect(await screen.findByText(NO_RACES_MESSAGE)).toBeInTheDocument()
    expect(screen.getAllByText('—')).toHaveLength(3)
    expect(screen.getByText('0 de 0 con resultado')).toBeInTheDocument()
  })
})
