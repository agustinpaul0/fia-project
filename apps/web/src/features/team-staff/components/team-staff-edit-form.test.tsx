import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { aTeamStaffMember } from '@/testing/team-staff-builders'
import { TeamStaffEditForm } from './team-staff-edit-form'

describe('TeamStaffEditForm', () => {
  const member = aTeamStaffMember()
  const teams = [{ id: member.teamId, name: 'Ferrari' }]

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
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(onSubmit).toHaveBeenCalledWith(member.id, {
      firstName: 'Carlos',
      lastName: member.lastName,
      teamId: member.teamId,
      roleInTeam: member.roleInTeam,
      phoneNumber: member.phoneNumber,
      version: member.version,
    })
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
})
