import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RequireDriver } from './require-driver'
import { RequireTeamStaff } from './require-team-staff'

vi.mock('@/lib/auth-client', () => ({ useSession: vi.fn() }))

const sessionWith = (role: string) => ({
  data: { user: { role, name: 'X' } },
  isPending: false,
  error: null,
})

describe('RequireTeamStaff y RequireDriver (matriz rol × área)', () => {
  it('muestra el contenido al personal de escudería', async () => {
    const { useSession } = await import('@/lib/auth-client')
    vi.mocked(useSession).mockReturnValue(sessionWith('team_staff') as never)
    render(<RequireTeamStaff>Bandeja</RequireTeamStaff>)
    expect(screen.getByText('Bandeja')).toBeInTheDocument()
  })

  it('rechaza a otros roles en RequireTeamStaff', async () => {
    const { useSession } = await import('@/lib/auth-client')
    vi.mocked(useSession).mockReturnValue(sessionWith('fia_admin') as never)
    render(<RequireTeamStaff>Bandeja</RequireTeamStaff>)
    expect(screen.getByText('No tenés permisos para realizar esta acción.')).toBeInTheDocument()
  })

  it('permite acceso a piloto en RequireDriver y rechaza a public', async () => {
    const { useSession } = await import('@/lib/auth-client')
    vi.mocked(useSession).mockReturnValue(sessionWith('driver') as never)
    const { unmount } = render(<RequireDriver>Panel Piloto</RequireDriver>)
    expect(screen.getByText('Panel Piloto')).toBeInTheDocument()
    unmount()
    vi.mocked(useSession).mockReturnValue(sessionWith('public') as never)
    render(<RequireDriver>Panel Piloto</RequireDriver>)
    expect(screen.getByText('No tenés permisos para realizar esta acción.')).toBeInTheDocument()
  })
})
