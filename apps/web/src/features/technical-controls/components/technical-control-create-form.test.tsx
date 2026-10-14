import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TechnicalControlCreateForm } from './technical-control-create-form'

vi.mock('@/features/teams/hooks/use-team-options', () => ({
  useTeamOptions: () => ({
    data: [{ id: '00000000-0000-4000-8000-000000000001', name: 'Ferrari' }],
  }),
}))

describe('TechnicalControlCreateForm', () => {
  it('envía datos válidos al completar el formulario', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const onCancel = vi.fn()
    render(<TechnicalControlCreateForm onCancel={onCancel} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/Escudería/), {
      target: { value: '00000000-0000-4000-8000-000000000001' },
    })
    fireEvent.change(screen.getByLabelText(/Tipo de control/), {
      target: { value: 'weight' },
    })
    fireEvent.change(screen.getByLabelText(/Dictamen/), {
      target: { value: 'passed' },
    })
    fireEvent.change(screen.getByLabelText(/Número de auto/), {
      target: { value: '16' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Registrar control' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        teamId: '00000000-0000-4000-8000-000000000001',
        driverId: null,
        carNumber: 16,
        raceId: null,
        controlType: 'weight',
        status: 'passed',
        notes: '',
      })
    })
  })

  it('llama a onCancel al pulsar Cancelar', () => {
    const onCancel = vi.fn()
    render(<TechnicalControlCreateForm onCancel={onCancel} onSubmit={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalled()
  })
})
