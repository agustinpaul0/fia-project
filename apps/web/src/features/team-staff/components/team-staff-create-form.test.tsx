import type { CreateTeamStaffBody } from '@fia/shared/contracts'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TeamStaffCreateForm } from './team-staff-create-form'

const TEAMS = [
  { id: '00000000-0000-4000-8000-000000000001', name: 'Ferrari' },
  { id: '00000000-0000-4000-8000-000000000002', name: 'McLaren' },
]

const BODY: CreateTeamStaffBody = {
  firstName: 'Charles',
  lastName: 'Leclerc',
  email: 'charles@ferrari.com',
  password: 'Password123!',
  teamId: '00000000-0000-4000-8000-000000000002',
  roleInTeam: 'Jefe de Mecánicos',
  phoneNumber: '+54 9 291 1234567',
  fileNumber: 'LEG-1234',
}

const LABELS: Readonly<Record<keyof CreateTeamStaffBody, string>> = {
  firstName: 'Nombre',
  lastName: 'Apellido',
  email: 'Correo electrónico',
  password: 'Contraseña inicial',
  teamId: 'Escudería',
  roleInTeam: 'Cargo en la escudería',
  phoneNumber: 'Teléfono',
  fileNumber: 'Legajo',
}

const fillForm = (): void => {
  for (const [field, label] of Object.entries(LABELS)) {
    const value = BODY[field as keyof CreateTeamStaffBody]
    fireEvent.change(screen.getByLabelText(label), { target: { value } })
  }
}

const submit = (): void => {
  fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
}

const renderForm = (onSubmit: (data: CreateTeamStaffBody) => Promise<void>) =>
  render(<TeamStaffCreateForm teams={TEAMS} onCancel={vi.fn()} onSubmit={onSubmit} />)

describe('TeamStaffCreateForm', () => {
  it('envía exactamente los datos cargados en cada campo', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    renderForm(onSubmit)
    fillForm()
    submit()
    expect(onSubmit).toHaveBeenCalledWith(BODY)
    expect(await screen.findByLabelText('Nombre')).toHaveValue('')
  })

  it('muestra "Guardando..." y deshabilita el envío mientras espera', () => {
    renderForm(() => new Promise(() => null))
    fillForm()
    submit()
    expect(screen.getByRole('button', { name: 'Guardando...' })).toBeDisabled()
  })

  it('conserva los datos y muestra el mensaje del error', async () => {
    renderForm(vi.fn().mockRejectedValue(new Error('Email duplicado')))
    fillForm()
    submit()
    expect(await screen.findByText('Email duplicado')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toHaveValue(BODY.firstName)
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeEnabled()
  })

  it('usa un mensaje genérico si el error no es un Error', async () => {
    renderForm(vi.fn().mockRejectedValue('fallo'))
    fillForm()
    submit()
    expect(await screen.findByText('Error al crear el personal')).toBeInTheDocument()
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
