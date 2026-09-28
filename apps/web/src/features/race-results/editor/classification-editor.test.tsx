import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { aClassification, anEligibleDriver, aRaceSummary, RACE_ID } from '@/testing/race-builders'
import { renderWithQuery } from '@/testing/render-with-query'
import { ClassificationEditor } from './classification-editor'
import { INCOMPLETE_MESSAGE } from './editor-actions'

const DRIVERS = [1, 2, 3].map(anEligibleDriver)
const PUT = `PUT /races/${RACE_ID}/classification` as const
const idOf = (n: number): string => anEligibleDriver(n).id

const renderEditor = (classification = aClassification()) =>
  renderWithQuery(<ClassificationEditor classification={classification} drivers={DRIVERS} />)

const selectFor = (position: number) =>
  screen.getByRole('combobox', { name: `Piloto en la posición ${position}` })

describe('ClassificationEditor', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('precarga la clasificación y muestra los puntos de cada posición', () => {
    renderEditor()
    expect(selectFor(1)).toHaveValue(idOf(1))
    expect(selectFor(2)).toHaveValue(idOf(2))
    expect(screen.getByText('25 pts')).toBeInTheDocument()
    expect(screen.getByText('18 pts')).toBeInTheDocument()
  })

  it('usa la escala sprint en carreras sprint', () => {
    renderEditor(aClassification({ race: aRaceSummary({ type: 'sprint' }) }))
    expect(screen.getByText('8 pts')).toBeInTheDocument()
    expect(screen.getByText('7 pts')).toBeInTheDocument()
  })

  it('agrega, reordena y guarda enviando la versión y el orden exacto', async () => {
    const calls = mockFetchRoutes({ [PUT]: () => jsonResponse(aClassification()) })
    renderEditor()
    fireEvent.click(screen.getByRole('button', { name: 'Agregar piloto' }))
    fireEvent.change(selectFor(3), { target: { value: idOf(3) } })
    fireEvent.click(screen.getByRole('button', { name: 'Subir la posición 3' }))
    fireEvent.click(screen.getByRole('button', { name: 'Guardar resultado' }))
    await waitFor(() => expect(calls).toHaveLength(1))
    const entries = [idOf(1), idOf(3), idOf(2)].map((driverId) => ({ driverId }))
    expect(calls[0]?.body).toEqual({ version: 3, entries })
  })

  it('no ofrece pilotos que ya ocupan otra posición', () => {
    renderEditor()
    fireEvent.click(screen.getByRole('button', { name: 'Agregar piloto' }))
    const options = [...selectFor(3).querySelectorAll('option')].map((o) => o.value)
    expect(options).toEqual(['', idOf(3)])
    expect(screen.getByRole('button', { name: 'Agregar piloto' })).toBeDisabled()
  })

  it('bloquea el guardado mientras falte elegir un piloto', () => {
    renderEditor()
    fireEvent.click(screen.getByRole('button', { name: 'Agregar piloto' }))
    expect(screen.getByText(INCOMPLETE_MESSAGE)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Guardar resultado' })).toBeDisabled()
  })

  it('quita posiciones y no deja bajar la última ni subir la primera', () => {
    renderEditor()
    expect(screen.getByRole('button', { name: 'Subir la posición 1' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Bajar la posición 2' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Quitar la posición 1' }))
    expect(selectFor(1)).toHaveValue(idOf(2))
    fireEvent.click(screen.getByRole('button', { name: 'Bajar la posición 1' }))
  })
})
