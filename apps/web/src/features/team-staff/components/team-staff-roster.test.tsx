import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { aTeamStaffMember } from '@/testing/team-staff-builders'
import { TeamStaffRoster } from './team-staff-roster'

const MCLAREN = { id: '00000000-0000-4000-8000-000000000020', name: 'McLaren' }
const FERRARI = { id: '00000000-0000-4000-8000-000000000010', name: 'Ferrari' }
const members = [
  aTeamStaffMember(),
  aTeamStaffMember({
    id: 'n',
    firstName: 'Lando',
    lastName: 'Norris',
    email: 'lando@mclaren.com',
    teamId: MCLAREN.id,
    teamName: 'McLaren',
  }),
]

const renderRoster = () =>
  render(
    <TeamStaffRoster
      members={members}
      teams={[FERRARI, MCLAREN]}
      onEdit={vi.fn()}
      onDeactivate={vi.fn()}
    />,
  )

describe('TeamStaffRoster', () => {
  it('filtra por texto y por escudería, y limpia los filtros', () => {
    renderRoster()
    expect(screen.getByText('Mostrando 2 de 2 cuentas registradas')).toBeInTheDocument()
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'lando' } })
    expect(screen.queryByText('Charles Leclerc')).not.toBeInTheDocument()
    expect(screen.getByText('Lando Norris')).toBeInTheDocument()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: FERRARI.id } })
    expect(screen.getByText('Mostrando 0 de 2 cuentas registradas')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar' }))
    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.getByRole('combobox')).toHaveValue('')
    expect(screen.getByText('Mostrando 2 de 2 cuentas registradas')).toBeInTheDocument()
  })

  it('ofrece todas las escuderías en el filtro', () => {
    renderRoster()
    const options = screen.getAllByRole('option').map((option) => option.textContent)
    expect(options).toEqual(['Todas las escuderías (2)', 'Ferrari', 'McLaren'])
  })
})
