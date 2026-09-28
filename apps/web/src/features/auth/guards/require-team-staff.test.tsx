import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RequireTeamStaff } from './require-team-staff'

vi.mock('@/lib/auth-client', () => ({ useSession: vi.fn() }))

const sessionWith = (role: string) => ({
  data: { user: { role, name: 'X' } },
  isPending: false,
  error: null,
})

describe('RequireTeamStaff', () => {
  it('muestra el contenido al personal de escudería', async () => {
    const { useSession } = await import('@/lib/auth-client')
    vi.mocked(useSession).mockReturnValue(sessionWith('team_staff') as never)
    render(<RequireTeamStaff>Bandeja</RequireTeamStaff>)
    expect(screen.getByText('Bandeja')).toBeInTheDocument()
  })

  it('rechaza a otros roles', async () => {
    const { useSession } = await import('@/lib/auth-client')
    vi.mocked(useSession).mockReturnValue(sessionWith('fia_admin') as never)
    render(<RequireTeamStaff>Bandeja</RequireTeamStaff>)
    expect(screen.getByText('No tenés permisos para realizar esta acción.')).toBeInTheDocument()
  })
})
