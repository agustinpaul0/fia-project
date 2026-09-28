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

describe('LoginForm', () => {
  it('renderiza los campos de email y contraseña', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument()
  })

  it('muestra mensaje de error si las credenciales fallan', async () => {
    const user = userEvent.setup()
    const { signIn } = await import('@/lib/auth-client')
    vi.mocked(signIn.email).mockResolvedValue({
      error: { message: 'El correo electrónico o la contraseña son incorrectos.' },
    } as never)

    render(<LoginForm />)
    await user.type(screen.getByLabelText('Correo electrónico'), 'admin@fia.com')
    await user.type(screen.getByLabelText('Contraseña'), 'AdminPassword123!')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(
      await screen.findByText('El correo electrónico o la contraseña son incorrectos.'),
    ).toBeInTheDocument()
  })

  it('navega a la raíz tras un inicio de sesión exitoso', async () => {
    const user = userEvent.setup()
    const { signIn } = await import('@/lib/auth-client')
    vi.mocked(signIn.email).mockResolvedValue({ error: null } as never)

    render(<LoginForm />)
    await user.type(screen.getByLabelText('Correo electrónico'), 'admin@fia.com')
    await user.type(screen.getByLabelText('Contraseña'), 'AdminPassword123!')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/' })
  })
})
