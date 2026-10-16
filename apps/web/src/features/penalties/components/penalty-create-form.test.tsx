import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { renderWithQuery } from '@/testing/render-with-query'
import { PenaltyCreateForm } from './penalty-create-form'

const FERRARI = '00000000-0000-4000-8000-000000000001'
const LECLERC = '00000000-0000-4000-8000-000000000002'

const renderForm = (onSubmit = vi.fn().mockResolvedValue(undefined), onCancel = vi.fn()) => {
  mockFetchRoutes({
    'GET /teams': () => jsonResponse([{ id: FERRARI, name: 'Ferrari' }]),
    [`GET /teams/${FERRARI}/drivers`]: () =>
      jsonResponse([{ id: LECLERC, name: 'Charles Leclerc' }]),
  })
  renderWithQuery(<PenaltyCreateForm onCancel={onCancel} onSubmit={onSubmit} />)
  return { onSubmit, onCancel }
}

const fillCommon = async (): Promise<void> => {
  fireEvent.change(await screen.findByLabelText('Escudería'), { target: { value: FERRARI } })
  fireEvent.change(screen.getByLabelText('Tipo de sanción'), { target: { value: 'grid_penalty' } })
  fireEvent.change(screen.getByLabelText('Sanción aplicada'), { target: { value: '3 puestos' } })
  fireEvent.change(screen.getByLabelText(/Motivo/), { target: { value: 'Impedir a otro piloto.' } })
}

describe('PenaltyCreateForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sanciona a la escudería completa si no se elige piloto', async () => {
    const { onSubmit } = renderForm()
    await screen.findByRole('option', { name: 'Ferrari' })
    await fillCommon()
    fireEvent.click(screen.getByRole('button', { name: 'Registrar sanción' }))
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        teamId: FERRARI,
        driverId: null,
        raceId: null,
        type: 'grid_penalty',
        penalty: '3 puestos',
        reason: 'Impedir a otro piloto.',
      }),
    )
  })

  it('ofrece los pilotos de la escudería elegida y sanciona al piloto', async () => {
    const { onSubmit } = renderForm()
    await screen.findByRole('option', { name: 'Ferrari' })
    await fillCommon()
    await screen.findByRole('option', { name: 'Charles Leclerc' })
    fireEvent.change(screen.getByLabelText('Piloto'), { target: { value: LECLERC } })
    fireEvent.click(screen.getByRole('button', { name: 'Registrar sanción' }))
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ driverId: LECLERC })),
    )
  })

  it('valida escudería, sanción y motivo antes de enviar', async () => {
    const { onSubmit } = renderForm()
    fireEvent.click(screen.getByRole('button', { name: 'Registrar sanción' }))
    expect(await screen.findByText('Elegí una escudería válida.')).toBeInTheDocument()
    expect(
      screen.getByText('La penalización debe tener al menos 2 caracteres.'),
    ).toBeInTheDocument()
    expect(screen.getByText('El motivo debe tener al menos 5 caracteres.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('muestra el error del servidor y uno genérico si no trae mensaje', async () => {
    const onSubmit = vi.fn().mockRejectedValueOnce(new Error('Escudería inexistente'))
    renderForm(onSubmit)
    await screen.findByRole('option', { name: 'Ferrari' })
    await fillCommon()
    fireEvent.click(screen.getByRole('button', { name: 'Registrar sanción' }))
    expect(await screen.findByText('Escudería inexistente')).toBeInTheDocument()
    onSubmit.mockRejectedValueOnce('fallo')
    fireEvent.click(screen.getByRole('button', { name: 'Registrar sanción' }))
    expect(await screen.findByText('Error al registrar la sanción')).toBeInTheDocument()
  })

  it('llama a onCancel al pulsar Cancelar', () => {
    const { onCancel } = renderForm()
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalled()
  })
})
