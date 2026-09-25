import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RequireFiaAdmin } from './require-fia-admin'

vi.mock('@/lib/auth-client', () => ({
  useSession: vi.fn(),
}))

describe('RequireFiaAdmin', () => {
  it('muestra skeleton mientras carga la sesión', async () => {
    const { useSession } = await import('@/lib/auth-client')
    vi.mocked(useSession).mockReturnValue({ data: null, isPending: true, error: null } as never)
    const { container } = render(
      <RequireFiaAdmin>
        <div>Contenido protegido</div>
      </RequireFiaAdmin>,
    )
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument()
  })

  it('muestra mensaje si no hay sesión iniciada', async () => {
    const { useSession } = await import('@/lib/auth-client')
    vi.mocked(useSession).mockReturnValue({ data: null, isPending: false, error: null } as never)
    render(
      <RequireFiaAdmin>
        <div>Contenido protegido</div>
      </RequireFiaAdmin>,
    )
    expect(
      screen.getByText('Tenés que iniciar sesión para realizar esta acción.'),
    ).toBeInTheDocument()
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument()
  })

  it('muestra mensaje de prohibido si el rol no es fia_admin', async () => {
    const { useSession } = await import('@/lib/auth-client')
    vi.mocked(useSession).mockReturnValue({
      data: { user: { role: 'team_staff' } },
      isPending: false,
      error: null,
    } as never)
    render(
      <RequireFiaAdmin>
        <div>Contenido protegido</div>
      </RequireFiaAdmin>,
    )
    expect(screen.getByText('No tenés permisos para realizar esta acción.')).toBeInTheDocument()
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument()
  })

  it('renderiza children si el rol es fia_admin', async () => {
    const { useSession } = await import('@/lib/auth-client')
    vi.mocked(useSession).mockReturnValue({
      data: { user: { role: 'fia_admin' } },
      isPending: false,
      error: null,
    } as never)
    render(
      <RequireFiaAdmin>
        <div>Contenido protegido</div>
      </RequireFiaAdmin>,
    )
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
  })
})
