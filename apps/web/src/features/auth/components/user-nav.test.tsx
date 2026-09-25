import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { UserNav } from './user-nav'

vi.mock('@/lib/auth-client', () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

describe('UserNav', () => {
  it('muestra botón de iniciar sesión cuando no hay sesión activa', async () => {
    const { useSession } = await import('@/lib/auth-client')
    vi.mocked(useSession).mockReturnValue({ data: null, isPending: false, error: null } as never)
    render(<UserNav />)
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument()
  })

  it('muestra nombre, rol y acceso a Personal cuando es fia_admin', async () => {
    const { useSession } = await import('@/lib/auth-client')
    vi.mocked(useSession).mockReturnValue({
      data: { user: { name: 'Admin FIA', role: 'fia_admin' } },
      isPending: false,
      error: null,
    } as never)
    render(<UserNav />)
    expect(screen.getByText('Admin FIA')).toBeInTheDocument()
    expect(screen.getByText('fia_admin')).toBeInTheDocument()
    expect(screen.getByText('Personal')).toBeInTheDocument()
    expect(screen.getByText('Salir')).toBeInTheDocument()
  })

  it('muestra rol public si no tiene rol definido', async () => {
    const { useSession } = await import('@/lib/auth-client')
    vi.mocked(useSession).mockReturnValue({
      data: { user: { name: 'Anon' } },
      isPending: false,
      error: null,
    } as never)
    render(<UserNav />)
    expect(screen.getByText('public')).toBeInTheDocument()
  })

  it('ejecuta signOut al hacer click en Salir', async () => {
    const { useSession, signOut } = await import('@/lib/auth-client')
    vi.mocked(useSession).mockReturnValue({
      data: { user: { name: 'Admin FIA', role: 'fia_admin' } },
      isPending: false,
      error: null,
    } as never)
    render(<UserNav />)
    fireEvent.click(screen.getByText('Salir'))
    expect(signOut).toHaveBeenCalled()
  })
})
