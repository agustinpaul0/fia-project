import { AppError } from '@fia/shared/domain'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { aTeamStaffMember } from '@/testing/team-staff-builders'
import { TeamStaffEditForm } from './team-staff-edit-form'

describe('TeamStaffEditForm', () => {
  const member = aTeamStaffMember()
  const OTHER_TEAM = { id: '00000000-0000-4000-8000-000000000077', name: 'McLaren' }
  const teams = [{ id: member.teamId, name: 'Ferrari' }, OTHER_TEAM]

  it('carga datos existentes, permite editar y envía', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const onCancel = vi.fn()
    render(
      <TeamStaffEditForm member={member} teams={teams} onCancel={onCancel} onSubmit={onSubmit} />,
    )

    expect(screen.getByDisplayValue(member.firstName)).toBeInTheDocument()
    expect(screen.getByDisplayValue(member.email)).toBeDisabled()
    expect(screen.getByDisplayValue(member.fileNumber)).toBeDisabled()

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Carlos' } })
    fireEvent.change(screen.getByLabelText('Apellido'), { target: { value: 'Sainz' } })
    fireEvent.change(screen.getByLabelText('Escudería'), { target: { value: OTHER_TEAM.id } })
    fireEvent.change(screen.getByLabelText('Cargo en la escudería'), {
      target: { value: 'Director Deportivo' },
    })
    fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '+54 9 11 5555555' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    await vi.waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(member.id, {
        firstName: 'Carlos',
        lastName: 'Sainz',
        teamId: OTHER_TEAM.id,
        roleInTeam: 'Director Deportivo',
        phoneNumber: '+54 9 11 5555555',
        version: member.version,
      }),
    )
  })

  it('muestra mensaje si la edición falla con Error o texto plano', async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValueOnce(new Error('Conflicto'))
      .mockRejectedValueOnce('fallo')
    render(
      <TeamStaffEditForm member={member} teams={teams} onCancel={vi.fn()} onSubmit={onSubmit} />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(await screen.findByText('Conflicto')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(await screen.findByText('Error al actualizar el personal')).toBeInTheDocument()
  })

  it('marca los campos inválidos antes de enviar', async () => {
    const onSubmit = vi.fn()
    render(
      <TeamStaffEditForm member={member} teams={teams} onCancel={vi.fn()} onSubmit={onSubmit} />,
    )
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: '   ' } })
    fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '12' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(await screen.findByText('El nombre es obligatorio.')).toBeInTheDocument()
    expect(
      screen.getByText('El teléfono debe tener entre 7 y 30 caracteres válidos.'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Teléfono')).toHaveAttribute('aria-invalid', 'true')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('muestra en su campo el error que devuelve el servidor', async () => {
    const fields = { roleInTeam: ['El cargo debe tener al menos 2 caracteres.'] }
    const onSubmit = vi.fn().mockRejectedValue(new AppError('VALIDATION_FAILED', fields))
    render(
      <TeamStaffEditForm member={member} teams={teams} onCancel={vi.fn()} onSubmit={onSubmit} />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(
      await screen.findByText('El cargo debe tener al menos 2 caracteres.'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Cargo en la escudería')).toHaveAttribute('aria-invalid', 'true')
  })
})
