import { fireEvent, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { PenaltyCreateForm } from '@/features/penalties/components/penalty-create-form'
import { jsonResponse } from './mock-fetch'
import { mockFetchRoutes } from './mock-fetch-routes'
import { renderWithQuery } from './render-with-query'

export const FERRARI = '00000000-0000-4000-8000-000000000001'
export const LECLERC = '00000000-0000-4000-8000-000000000002'
export const MONACO = '00000000-0000-4000-8000-000000000003'

export const renderForm = (onSubmit = vi.fn().mockResolvedValue(undefined), onCancel = vi.fn()) => {
  mockFetchRoutes({
    'GET /teams': () => jsonResponse([{ id: FERRARI, name: 'Ferrari' }]),
    [`GET /teams/${FERRARI}/drivers`]: () =>
      jsonResponse([{ id: LECLERC, name: 'Charles Leclerc' }]),
    [`GET /teams/${FERRARI}/races?season=2026`]: () =>
      jsonResponse([{ id: MONACO, name: 'GP de Mónaco', date: '2026-05-24T13:00:00.000Z' }]),
  })
  renderWithQuery(<PenaltyCreateForm onCancel={onCancel} onSubmit={onSubmit} />)
  return { onSubmit, onCancel }
}

export const fillCommon = async (): Promise<void> => {
  fireEvent.change(await screen.findByLabelText('Escudería'), { target: { value: FERRARI } })
  fireEvent.change(screen.getByLabelText('Tipo de sanción'), { target: { value: 'grid_penalty' } })
  fireEvent.change(screen.getByLabelText('Sanción aplicada'), { target: { value: '3 puestos' } })
  fireEvent.change(screen.getByLabelText(/Motivo/), { target: { value: 'Impedir a otro piloto.' } })
}
