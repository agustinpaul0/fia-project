import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { aTeamStaffMember } from '@/testing/team-staff-builders'
import { TeamStaffTable } from './team-staff-table'

describe('TeamStaffTable', () => {
  it('muestra estado vacío si no hay miembros', () => {
    render(<TeamStaffTable members={[]} onEdit={vi.fn()} onDeactivate={vi.fn()} />)
    expect(screen.getByText('Todavía no hay personal de escuderías cargado.')).toBeInTheDocument()
  })

  it('muestra datos del personal y maneja clicks de edición y baja', () => {
    const onEdit = vi.fn()
    const onDeactivate = vi.fn()
    const active = aTeamStaffMember({ firstName: 'Carlos', lastName: 'Sainz' })
    const inactive = aTeamStaffMember({
      id: '2',
      firstName: 'Lando',
      lastName: 'Norris',
      isActive: false,
    })

    render(
      <TeamStaffTable members={[active, inactive]} onEdit={onEdit} onDeactivate={onDeactivate} />,
    )

    expect(screen.getByText('Sainz, Carlos')).toBeInTheDocument()
    expect(screen.getByText('Norris, Lando')).toBeInTheDocument()
    expect(screen.getByText('Activo')).toBeInTheDocument()
    expect(screen.getByText('Inactivo')).toBeInTheDocument()

    const [firstEdit, secondEdit] = screen.getAllByRole('button', { name: 'Editar' })
    expect(firstEdit).toBeDefined()
    expect(firstEdit).toBeEnabled()
    expect(secondEdit).toBeDisabled()

    const [firstDeact, secondDeact] = screen.getAllByRole('button', { name: 'Dar de baja' })
    expect(firstDeact).toBeDefined()
    expect(firstDeact).toBeEnabled()
    expect(secondDeact).toBeDisabled()

    if (firstEdit) {
      fireEvent.click(firstEdit)
      expect(onEdit).toHaveBeenCalledWith(active)
    }

    if (firstDeact) {
      fireEvent.click(firstDeact)
      expect(onDeactivate).toHaveBeenCalledWith(active)
    }
  })
})
