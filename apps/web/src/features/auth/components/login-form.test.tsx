import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LoginForm } from './login-form'

const mockNavigate = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('@/lib/auth-client', () => ({
  signIn: { email: vi.fn() },
}))

const submitLogin = async (): Promise<void> => {
  const user = userEvent.setup()
  render(<LoginForm />)
  await user.type(screen.getByLabelText('Correo electrónico'), 'admin@fia.com')
  await user.type(screen.getByLabelText('Contraseña'), 'AdminPassword123!')
  await user.click(screen.getByRole('button', { name: '[ Iniciar sesión ]' }))
}

describe('LoginForm', () => {
  it('renderiza los campos de email y contraseña', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '[ Iniciar sesión ]' })).toBeInTheDocument()
  })

  it('permite mostrar y volver a ocultar la contraseña', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    const password = screen.getByLabelText('Contraseña')
    expect(password).toHaveAttribute('type', 'password')
    await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }))
    expect(password).toHaveAttribute('type', 'text')
    await user.click(screen.getByRole('button', { name: 'Ocultar contraseña' }))
    expect(password).toHaveAttribute('type', 'password')
  })

  it('muestra mensaje genérico si las credenciales fallan', async () => {
    const { signIn } = await import('@/lib/auth-client')
    vi.mocked(signIn.email).mockResolvedValue({ error: { message: 'Cualquier error' } } as never)
    await submitLogin()
    expect(await screen.findByText('Credenciales inválidas.')).toBeInTheDocument()
  })

  it('avisa que hay que esperar si se superó el límite de intentos', async () => {
    const { signIn } = await import('@/lib/auth-client')
    vi.mocked(signIn.email).mockResolvedValue({ error: { status: 429 } } as never)
    await submitLogin()
    expect(await screen.findByText(/Hiciste demasiados intentos/)).toBeInTheDocument()
  })

  it('navega a la vista de administración tras login de fia_admin', async () => {
    const { signIn } = await import('@/lib/auth-client')
    vi.mocked(signIn.email).mockResolvedValue({
      data: { user: { role: 'fia_admin' } },
      error: null,
    } as never)
    await submitLogin()
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/admin/team-staff' })
  })

  it('navega a la raíz tras un inicio de sesión de usuario general', async () => {
    const { signIn } = await import('@/lib/auth-client')
    vi.mocked(signIn.email).mockResolvedValue({
      data: { user: { role: 'public' } },
      error: null,
    } as never)
    await submitLogin()
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/' })
  })

  it('navega a pilotos de escudería tras login de team_staff', async () => {
    const { signIn } = await import('@/lib/auth-client')
    vi.mocked(signIn.email).mockResolvedValue({
      data: { user: { role: 'team_staff' } },
      error: null,
    } as never)
    await submitLogin()
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/team/drivers' })
  })

  it('navega al panel del piloto tras login de una cuenta oficial de piloto (US-29)', async () => {
    const { signIn } = await import('@/lib/auth-client')
    vi.mocked(signIn.email).mockResolvedValue({
      data: { user: { role: 'driver' } },
      error: null,
    } as never)
    await submitLogin()
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/driver' })
  })
})
