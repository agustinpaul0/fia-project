import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { aTeamStaffMember } from '@/testing/team-staff-builders'
import { NO_MATCHES_MESSAGE, TeamStaffTable } from './team-staff-table'

describe('TeamStaffTable', () => {
  it('avisa si la búsqueda no encontró integrantes', () => {
    render(<TeamStaffTable members={[]} total={3} onEdit={vi.fn()} onDeactivate={vi.fn()} />)
    expect(screen.getByText(NO_MATCHES_MESSAGE)).toBeInTheDocument()
    expect(screen.getByText('Mostrando 0 de 3 cuentas registradas')).toBeInTheDocument()
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
      <TeamStaffTable
        members={[active, inactive]}
        total={2}
        onEdit={onEdit}
        onDeactivate={onDeactivate}
      />,
    )

    expect(screen.getByText('Carlos Sainz')).toBeInTheDocument()
    expect(screen.getByText('Lando Norris')).toBeInTheDocument()
    expect(screen.getByText('CS')).toBeInTheDocument()
    expect(screen.getAllByText('Legajo LEG-1234')).toHaveLength(2)
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
