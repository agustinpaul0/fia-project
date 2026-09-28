import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { aTeamStaffMember } from '@/testing/team-staff-builders'
import { TeamStaffEditDialog } from './team-staff-edit-dialog'

describe('TeamStaffEditDialog', () => {
  it('no renderiza contenido si member es null', () => {
    render(
      <TeamStaffEditDialog member={null} onOpenChange={vi.fn()} teams={[]} onSubmit={vi.fn()} />,
    )
    expect(screen.queryByText('Editar integrante')).not.toBeInTheDocument()
  })

  it('envía datos editados y cierra el diálogo', async () => {
    const member = aTeamStaffMember()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const onOpenChange = vi.fn()
    const teams = [{ id: member.teamId, name: 'Ferrari' }]

    render(
      <TeamStaffEditDialog
        member={member}
        onOpenChange={onOpenChange}
        teams={teams}
        onSubmit={onSubmit}
      />,
    )

    fireEvent.change(screen.getByLabelText('Apellido'), { target: { value: 'Sainz' } })
    fireEvent.change(screen.getByLabelText('Cargo en la escudería'), {
      target: { value: 'Piloto' },
    })
    fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '+54 9 291 9999999' } })
    fireEvent.change(screen.getByLabelText('Escudería'), { target: { value: teams[0]?.id } })

    const form = screen.getByRole('button', { name: 'Guardar cambios' }).closest('form')
    if (form) {
      fireEvent.submit(form)
    }

    expect(onSubmit).toHaveBeenCalled()
    await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
  })
})
