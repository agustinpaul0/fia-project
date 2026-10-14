import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PenaltyCreateForm } from './penalty-create-form'

vi.mock('@/features/teams/hooks/use-team-options', () => ({
  useTeamOptions: () => ({
    data: [{ id: '00000000-0000-4000-8000-000000000001', name: 'Ferrari' }],
  }),
}))

describe('PenaltyCreateForm', () => {
  it('envía datos válidos al completar el formulario', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const onCancel = vi.fn()
    render(<PenaltyCreateForm onCancel={onCancel} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/Escudería/), {
      target: { value: '00000000-0000-4000-8000-000000000001' },
    })
    fireEvent.change(screen.getByLabelText(/Tipo de sanción/), {
      target: { value: 'time_penalty' },
    })
    fireEvent.change(screen.getByLabelText(/Sanción aplicada/), {
      target: { value: '5s recargo' },
    })
    fireEvent.change(screen.getByLabelText(/Motivo/), {
      target: { value: 'Infracción de límites de pista.' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Registrar sanción' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        teamId: '00000000-0000-4000-8000-000000000001',
        driverId: null,
        raceId: null,
        type: 'time_penalty',
        penalty: '5s recargo',
        reason: 'Infracción de límites de pista.',
      })
    })
  })

  it('llama a onCancel al pulsar Cancelar', () => {
    const onCancel = vi.fn()
    render(<PenaltyCreateForm onCancel={onCancel} onSubmit={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalled()
  })
})
