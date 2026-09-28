import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { aClassification, aRaceSummary, RACE_ID } from '@/testing/race-builders'
import { renderWithQuery } from '@/testing/render-with-query'
import { NO_RESULTS_MESSAGE } from './classification-table'
import { RaceClassificationView } from './race-classification-view'

const PATH = `GET /races/${RACE_ID}/classification` as const

describe('RaceClassificationView', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('muestra el encabezado y la tabla con posiciones y puntos', async () => {
    mockFetchRoutes({ [PATH]: () => jsonResponse(aClassification()) })
    renderWithQuery(<RaceClassificationView raceId={RACE_ID} />)
    expect(await screen.findByText('Gran Premio de Mónaco 2025')).toBeInTheDocument()
    expect(screen.getByText('Gran Premio')).toBeInTheDocument()
    expect(screen.getByText(/25\/5\/25, 10:00 \(hora argentina\)/)).toBeInTheDocument()
    const rows = screen.getAllByRole('row')
    expect(rows[1]).toHaveTextContent('1NOR Piloto 1Escudería 125')
    expect(rows[2]).toHaveTextContent('2LEC Piloto 2Escudería 218')
  })

  it('avisa si todavía no hay resultado cargado', async () => {
    const empty = aClassification({ race: aRaceSummary({ type: 'sprint' }), results: [] })
    mockFetchRoutes({ [PATH]: () => jsonResponse(empty) })
    renderWithQuery(<RaceClassificationView raceId={RACE_ID} />)
    expect(await screen.findByText(NO_RESULTS_MESSAGE)).toBeInTheDocument()
    expect(screen.getByText('Sprint')).toBeInTheDocument()
  })

  it('muestra un error claro si la carrera no existe', async () => {
    const error = { code: 'RACE_NOT_FOUND', message: 'x', fields: null }
    mockFetchRoutes({ [PATH]: () => jsonResponse({ error }, 404) })
    renderWithQuery(<RaceClassificationView raceId={RACE_ID} />)
    expect(await screen.findByText('La carrera no existe o fue eliminada.')).toBeInTheDocument()
  })
})
