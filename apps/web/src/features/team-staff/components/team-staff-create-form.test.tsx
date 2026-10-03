import type { CreateTeamStaffBody } from '@fia/shared/contracts'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { aCreateBody, fillCreateForm } from '@/testing/team-staff-form'
import { PASSWORD_HINT } from './team-staff-create-fields'
import { TeamStaffCreateForm } from './team-staff-create-form'

const TEAMS = [
  { id: '00000000-0000-4000-8000-000000000001', name: 'Ferrari' },
  { id: '00000000-0000-4000-8000-000000000002', name: 'McLaren' },
]

const BODY = aCreateBody('00000000-0000-4000-8000-000000000002')

const submit = (): void => {
  fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
}

const renderForm = (onSubmit: (data: CreateTeamStaffBody) => Promise<void>) =>
  render(<TeamStaffCreateForm teams={TEAMS} onCancel={vi.fn()} onSubmit={onSubmit} />)

describe('TeamStaffCreateForm', () => {
  it('envía exactamente los datos cargados y limpia el formulario', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    renderForm(onSubmit)
    fillCreateForm(BODY)
    submit()
    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledWith(BODY))
    await vi.waitFor(() => expect(screen.getByLabelText('Nombre')).toHaveValue(''))
  })

  it('muestra "Guardando..." y deshabilita el envío mientras espera', async () => {
    renderForm(() => new Promise(() => null))
    fillCreateForm(BODY)
    submit()
    expect(await screen.findByRole('button', { name: 'Guardando...' })).toBeDisabled()
  })

  it('marca en cada campo lo que no cumple las reglas, sin enviar', async () => {
    const onSubmit = vi.fn()
    renderForm(onSubmit)
    fillCreateForm({ ...BODY, password: 'corta', teamId: '', fileNumber: 'LEG 12' })
    submit()
    expect(
      await screen.findByText('La contraseña debe tener al menos 12 caracteres.'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña inicial')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Elegí una escudería.')).toBeInTheDocument()
    expect(screen.getByLabelText('Escudería')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText(/El legajo debe contener/)).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toHaveAttribute('aria-invalid', 'false')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('explica las reglas de la contraseña antes de enviar', () => {
    renderForm(vi.fn())
    expect(screen.getByLabelText('Contraseña inicial')).toHaveAccessibleDescription(PASSWORD_HINT)
  })

  it('cancelar invoca onCancel sin enviar', () => {
    const onCancel = vi.fn()
    const onSubmit = vi.fn()
    render(<TeamStaffCreateForm teams={TEAMS} onCancel={onCancel} onSubmit={onSubmit} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalledOnce()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
