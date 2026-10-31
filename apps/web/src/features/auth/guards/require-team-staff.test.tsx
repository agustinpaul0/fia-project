import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RequireDriver } from './require-driver'
import { RequireTeamStaff } from './require-team-staff'

const navigate = vi.fn()
vi.mock('@tanstack/react-router', () => ({ useNavigate: () => navigate }))

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

  it('redirige a cada rol a su propia área cuando entra por URL a otra (US-29)', async () => {
    const { useSession } = await import('@/lib/auth-client')
    const cases = [
      ['fia_admin', '/admin/team-staff'],
      ['driver', '/driver'],
      ['public', '/'],
    ] as const
    for (const [role, home] of cases) {
      navigate.mockClear()
      vi.mocked(useSession).mockReturnValue(sessionWith(role) as never)
      const { unmount } = render(<RequireTeamStaff>Bandeja</RequireTeamStaff>)
      expect(navigate).toHaveBeenCalledWith({ to: home, replace: true })
      unmount()
    }
  })

  it('sin sesión redirige al login', async () => {
    const { useSession } = await import('@/lib/auth-client')
    navigate.mockClear()
    vi.mocked(useSession).mockReturnValue({ data: null, isPending: false, error: null } as never)
    render(<RequireDriver>Panel</RequireDriver>)
    expect(navigate).toHaveBeenCalledWith({ to: '/login', replace: true })
  })
})
