import { fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { aRaceSummary, RACE_ID } from '@/testing/race-builders'
import { renderWithRouter } from '@/testing/render-with-router'
import { SeasonRacesPanel } from './season-races-panel'

const NOW = new Date('2026-09-28T12:00:00.000Z')
const SPRINT = aRaceSummary({
  id: RACE_ID.replace('900', '901'),
  name: 'Sprint de Mónaco 2025',
  type: 'sprint',
  winnerName: null,
})

describe('SeasonRacesPanel', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('ofrece la temporada actual y las 5 anteriores, empezando por la última completa', async () => {
    mockFetchRoutes({ 'GET /races?season=2025': () => jsonResponse([aRaceSummary(), SPRINT]) })
    renderWithRouter(<SeasonRacesPanel target="public" now={NOW} />)
    const options = (await screen.findAllByRole('option')).map((o) => o.textContent)
    expect(options).toEqual(['2026', '2025', '2024', '2023', '2022', '2021'])
    expect(screen.getByRole('combobox')).toHaveValue('2025')
  })

  it('enlaza cada carrera a su página pública y muestra ganador o falta de resultados', async () => {
    mockFetchRoutes({ 'GET /races?season=2025': () => jsonResponse([aRaceSummary(), SPRINT]) })
    renderWithRouter(<SeasonRacesPanel target="public" now={NOW} />)
    const link = await screen.findByRole('link', { name: 'Gran Premio de Mónaco 2025' })
    expect(link).toHaveAttribute('href', `/races/${RACE_ID}`)
    expect(screen.getByText(/Lando Norris/)).toBeInTheDocument()
    expect(screen.getByText(/Sin resultados/)).toBeInTheDocument()
  })

  it('en modo admin enlaza al editor y al cambiar de temporada consulta esa temporada', async () => {
    mockFetchRoutes({
      'GET /races?season=2025': () => jsonResponse([aRaceSummary()]),
      'GET /races?season=2021': () => jsonResponse([]),
    })
    renderWithRouter(<SeasonRacesPanel target="admin" now={NOW} />)
    const link = await screen.findByRole('link', { name: 'Gran Premio de Mónaco 2025' })
    expect(link).toHaveAttribute('href', `/admin/results/${RACE_ID}`)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2021' } })
    const empty = 'No hay carreras registradas para esta temporada.'
    expect(await screen.findByText(empty)).toBeInTheDocument()
  })
})
