import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TechnicalControlCreateForm } from './technical-control-create-form'

const FERRARI = '00000000-0000-4000-8000-000000000001'

vi.mock('@/features/teams/hooks/use-team-options', () => ({
  useTeamOptions: () => ({ data: [{ id: FERRARI, name: 'Ferrari' }] }),
}))

const fill = (values: Readonly<Record<string, string>>): void => {
  for (const [label, value] of Object.entries(values)) {
    fireEvent.change(screen.getByLabelText(label), { target: { value } })
  }
}

const VALID = {
  Escudería: FERRARI,
  'Número de auto': '16',
  'Tipo de control': 'engine',
  Dictamen: 'rejected',
  'Fecha y hora del control': '2026-10-16T14:30',
  'Vigente hasta': '2026-10-23T14:30',
  Observaciones: 'Potencia fuera de norma.',
}

describe('TechnicalControlCreateForm', () => {
  it('envía fecha y hora en UTC, el vehículo y el dictamen', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<TechnicalControlCreateForm onCancel={vi.fn()} onSubmit={onSubmit} />)
    fill(VALID)
    fireEvent.click(screen.getByRole('button', { name: 'Registrar control' }))
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        teamId: FERRARI,
        driverId: null,
        carNumber: 16,
        raceId: null,
        controlType: 'engine',
        status: 'rejected',
        notes: 'Potencia fuera de norma.',
        inspectedAt: '2026-10-16T17:30:00.000Z',
        expiresAt: '2026-10-23T17:30:00.000Z',
      }),
    )
  })

  it('exige escudería, vehículo, fecha del control y vigencia', async () => {
    const onSubmit = vi.fn()
    render(<TechnicalControlCreateForm onCancel={vi.fn()} onSubmit={onSubmit} />)
    fireEvent.click(screen.getByRole('button', { name: 'Registrar control' }))
    expect(await screen.findByText('Elegí una escudería válida.')).toBeInTheDocument()
    expect(screen.getByText('Ingresá el número de auto inspeccionado.')).toBeInTheDocument()
    expect(screen.getByText('Ingresá la fecha y hora del control.')).toBeInTheDocument()
    expect(screen.getByText('Ingresá la fecha y hora de expiración.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('rechaza una vigencia anterior al control', async () => {
    render(<TechnicalControlCreateForm onCancel={vi.fn()} onSubmit={vi.fn()} />)
    fill({ ...VALID, 'Vigente hasta': '2026-10-15T14:30' })
    fireEvent.click(screen.getByRole('button', { name: 'Registrar control' }))
    expect(
      await screen.findByText('La expiración debe ser posterior al control.'),
    ).toBeInTheDocument()
  })

  it('muestra el error del servidor o uno genérico', async () => {
    const onSubmit = vi.fn().mockRejectedValueOnce(new Error('Escudería inexistente'))
    render(<TechnicalControlCreateForm onCancel={vi.fn()} onSubmit={onSubmit} />)
    fill(VALID)
    fireEvent.click(screen.getByRole('button', { name: 'Registrar control' }))
    expect(await screen.findByText('Escudería inexistente')).toBeInTheDocument()
    onSubmit.mockRejectedValueOnce('fallo')
    fireEvent.click(screen.getByRole('button', { name: 'Registrar control' }))
    expect(await screen.findByText('Error al registrar el control técnico')).toBeInTheDocument()
  })

  it('llama a onCancel al pulsar Cancelar', () => {
    const onCancel = vi.fn()
    render(<TechnicalControlCreateForm onCancel={onCancel} onSubmit={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalled()
  })
})
