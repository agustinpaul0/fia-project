import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { aClassification, aRaceSummary, aResult, RACE_ID } from '@/testing/race-builders'
import { renderWithRouter } from '@/testing/render-with-router'
import { NO_RESULTS_MESSAGE } from './classification-table'
import { RaceClassificationView } from './race-classification-view'

const PATH = `GET /races/${RACE_ID}/classification` as const

describe('RaceClassificationView', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('muestra el encabezado, la tabla y la distribución de puntos', async () => {
    const results = [aResult(1, 25), aResult(2, 18), { ...aResult(3, 15), teamName: 'Escudería 1' }]
    mockFetchRoutes({ [PATH]: () => jsonResponse(aClassification({ results })) })
    renderWithRouter(<RaceClassificationView raceId={RACE_ID} />)
    expect(
      await screen.findByRole('heading', { name: 'Gran Premio de Mónaco 2025' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Gran Premio')).toBeInTheDocument()
    expect(screen.getByText('Oficial final')).toBeInTheDocument()
    expect(screen.getByText('25/05/2025')).toBeInTheDocument()
    expect(screen.getByText('10:00 h (hora argentina)')).toBeInTheDocument()
    expect(screen.getByText('Revisión 1')).toBeInTheDocument()
    const rows = screen.getAllByRole('row')
    expect(rows[1]).toHaveTextContent('1NOR Piloto 1Escudería 125')
    expect(rows[2]).toHaveTextContent('2LEC Piloto 2Escudería 218')
    expect(screen.getByText('40 pts')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Volver a resultados/ })).toHaveAttribute(
      'href',
      '/results?category=F1',
    )
  })

  it('avisa si todavía no hay resultado cargado', async () => {
    const race = aRaceSummary({ type: 'sprint', resultsRevision: 0 })
    mockFetchRoutes({ [PATH]: () => jsonResponse(aClassification({ race, results: [] })) })
    renderWithRouter(<RaceClassificationView raceId={RACE_ID} />)
    expect(await screen.findByText(NO_RESULTS_MESSAGE)).toBeInTheDocument()
    expect(screen.getByText('Sprint')).toBeInTheDocument()
    expect(screen.getByText('Resultado pendiente')).toBeInTheDocument()
    expect(screen.getByText('Sin cargar')).toBeInTheDocument()
    expect(screen.getByText('Sin puntos otorgados todavía.')).toBeInTheDocument()
  })

  it('distingue los datos históricos y las correcciones', async () => {
    const historic = aClassification({ race: aRaceSummary({ resultsRevision: 0 }) })
    mockFetchRoutes({ [PATH]: () => jsonResponse(historic) })
    renderWithRouter(<RaceClassificationView raceId={RACE_ID} />)
    expect(await screen.findByText('Datos históricos')).toBeInTheDocument()
  })

  it('marca una corrección con su número de revisión', async () => {
    mockFetchRoutes({
      [PATH]: () => jsonResponse(aClassification({ race: aRaceSummary({ resultsRevision: 3 }) })),
    })
    renderWithRouter(<RaceClassificationView raceId={RACE_ID} />)
    expect(await screen.findByText('Corregido (revisión 3)')).toBeInTheDocument()
  })

  it('muestra un error claro si la carrera no existe', async () => {
    const error = { code: 'RACE_NOT_FOUND', message: 'x', fields: null }
    mockFetchRoutes({ [PATH]: () => jsonResponse({ error }, 404) })
    renderWithRouter(<RaceClassificationView raceId={RACE_ID} />)
    expect(await screen.findByText('La carrera no existe o fue eliminada.')).toBeInTheDocument()
  })
})
