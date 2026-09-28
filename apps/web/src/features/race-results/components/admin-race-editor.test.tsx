import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { aClassification, anEligibleDriver, aRaceSummary, RACE_ID } from '@/testing/race-builders'
import { renderWithQuery } from '@/testing/render-with-query'
import { AdminRaceEditor, RACE_NOT_RUN_MESSAGE } from './admin-race-editor'

const NOW = new Date('2026-09-28T12:00:00.000Z')
const GET = `GET /races/${RACE_ID}/classification` as const
const DRIVERS = `GET /races/${RACE_ID}/drivers` as const
const PUT = `PUT /races/${RACE_ID}/classification` as const

describe('AdminRaceEditor', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('no permite cargar una carrera que todavía no se corrió', async () => {
    const future = aClassification({ race: aRaceSummary({ date: '2026-12-06T15:00:00.000Z' }) })
    mockFetchRoutes({ [GET]: () => jsonResponse(future), [DRIVERS]: () => jsonResponse([]) })
    renderWithQuery(<AdminRaceEditor raceId={RACE_ID} now={NOW} />)
    expect(await screen.findByText(RACE_NOT_RUN_MESSAGE)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Guardar resultado' })).not.toBeInTheDocument()
  })

  it('avisa si la categoría no tiene pilotos', async () => {
    mockFetchRoutes({
      [GET]: () => jsonResponse(aClassification()),
      [DRIVERS]: () => jsonResponse([]),
    })
    renderWithQuery(<AdminRaceEditor raceId={RACE_ID} now={NOW} />)
    const message = 'No hay pilotos inscriptos en la categoría de esta carrera.'
    expect(await screen.findByText(message)).toBeInTheDocument()
  })

  it('ante un conflicto de versión recarga la clasificación vigente', async () => {
    const error = { code: 'STALE_VERSION', message: 'x', fields: null }
    const calls = mockFetchRoutes({
      [GET]: () => jsonResponse(aClassification()),
      [DRIVERS]: () => jsonResponse([1, 2].map(anEligibleDriver)),
      [PUT]: () => jsonResponse({ error }, 409),
    })
    renderWithQuery(<AdminRaceEditor raceId={RACE_ID} now={NOW} />)
    fireEvent.click(await screen.findByRole('button', { name: 'Guardar resultado' }))
    await waitFor(() => expect(calls.filter((c) => c.key === GET)).toHaveLength(2))
  })
})
