import type { CreateTeamStaffBody } from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { aCreateBody, fillCreateForm } from '@/testing/team-staff-form'
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

describe('TeamStaffCreateForm ante errores del servidor', () => {
  it('muestra en su campo los errores que devuelve el servidor', async () => {
    const fields = { phoneNumber: ['El teléfono debe tener entre 7 y 30 caracteres válidos.'] }
    renderForm(vi.fn().mockRejectedValue(new AppError('VALIDATION_FAILED', fields)))
    fillCreateForm(BODY)
    submit()
    expect(await screen.findByText(fields.phoneNumber[0] ?? '')).toBeInTheDocument()
    expect(screen.getByLabelText('Teléfono')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('marca el email cuando ya existe una cuenta con ese correo', async () => {
    renderForm(vi.fn().mockRejectedValue(new AppError('USER_ALREADY_EXISTS')))
    fillCreateForm(BODY)
    submit()
    await vi.waitFor(() =>
      expect(screen.getByLabelText('Correo electrónico')).toHaveAttribute('aria-invalid', 'true'),
    )
    expect(screen.getByLabelText('Nombre')).toHaveValue(BODY.firstName)
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeEnabled()
  })

  it('usa el mensaje del error o uno genérico si no es un Error', async () => {
    renderForm(
      vi.fn().mockRejectedValueOnce(new Error('Email duplicado')).mockRejectedValueOnce('fallo'),
    )
    fillCreateForm(BODY)
    submit()
    expect(await screen.findByText('Email duplicado')).toBeInTheDocument()
    submit()
    expect(await screen.findByText('Error al crear el personal')).toBeInTheDocument()
  })
})
