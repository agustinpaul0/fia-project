import type { DriverStanding } from '@fia/shared/contracts'
import { fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { aRaceSummary } from '@/testing/race-builders'
import { renderWithRouter } from '@/testing/render-with-router'
import { NO_RACES_MESSAGE } from './season-races-panel'
import { NO_STANDINGS_MESSAGE, SeasonResultsView } from './season-results-view'

const NOW = new Date('2026-09-28T12:00:00.000Z')

type StandingSpec = Pick<DriverStanding, 'position' | 'points' | 'wins'> & { readonly code: string }

const standing = ({ position, code, points, wins }: StandingSpec): DriverStanding => ({
  position,
  driverId: `00000000-0000-4000-8000-00000000000${position}`,
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

  it('muestra el campeonato y las carreras de la última temporada completa', async () => {
    mockFetchRoutes({
      'GET /races/standings?season=2025': () =>
        jsonResponse([
          standing({ position: 1, code: 'NOR', points: 101, wins: 3 }),
          standing({ position: 2, code: 'VER', points: 90, wins: 1 }),
        ]),
      'GET /races?season=2025': () => jsonResponse([aRaceSummary()]),
    })
    renderWithRouter(<SeasonResultsView now={NOW} />)
    expect(await screen.findByText('Campeonato de pilotos 2025')).toBeInTheDocument()
    const rows = await screen.findAllByRole('row')
    expect(rows[1]).toHaveTextContent('1NOR Piloto NOREquipo NOR3101')
    expect(rows[2]).toHaveTextContent('2VER Piloto VEREquipo VER190')
    expect(
      await screen.findByRole('link', { name: 'Gran Premio de Mónaco 2025' }),
    ).toBeInTheDocument()
  })

  it('al elegir otra temporada consulta sus datos y muestra los estados vacíos', async () => {
    mockFetchRoutes({
      'GET /races/standings?season=2025': () => jsonResponse([]),
      'GET /races?season=2025': () => jsonResponse([]),
      'GET /races/standings?season=2026': () => jsonResponse([]),
      'GET /races?season=2026': () => jsonResponse([]),
    })
    renderWithRouter(<SeasonResultsView now={NOW} />)
    fireEvent.change(await screen.findByRole('combobox'), { target: { value: '2026' } })
    expect(await screen.findByText('Campeonato de pilotos 2026')).toBeInTheDocument()
    expect(await screen.findByText(NO_STANDINGS_MESSAGE)).toBeInTheDocument()
    expect(await screen.findByText(NO_RACES_MESSAGE)).toBeInTheDocument()
  })
})
