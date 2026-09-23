import { describe, expect, it } from 'vitest'
import { authUserSchema, loginBodySchema, passwordSchema, sessionResponseSchema } from './auth'

describe('contratos de autenticación', () => {
  it('acepta credenciales válidas y normaliza el correo', () => {
    const parsed = loginBodySchema.parse({
      email: '  Admin@FIA.com ',
      password: 'AdminPassword123!',
    })
    expect(parsed.email).toBe('admin@fia.com')
  })

  it('rechaza un correo electrónico con formato inválido', () => {
    expect(
      loginBodySchema.safeParse({ email: 'invalido', password: 'AdminPassword123!' }).success,
    ).toBe(false)
  })

  it('rechaza contraseñas menores a 12 caracteres', () => {
    expect(passwordSchema.safeParse('Corta1!').success).toBe(false)
  })

  it('rechaza contraseñas sin mayúsculas o sin números', () => {
    expect(passwordSchema.safeParse('solominusculas123').success).toBe(false)
    expect(passwordSchema.safeParse('SOLOMAYUSCULAS123').success).toBe(false)
    expect(passwordSchema.safeParse('SinNumerosMayusYMinus').success).toBe(false)
  })

  it('acepta contraseñas robustas que cumplen la política', () => {
    expect(passwordSchema.safeParse('AdminPassword123!').success).toBe(true)
  })

  it('rechaza campos desconocidos en el cuerpo de login', () => {
    const invalid = { email: 'admin@fia.com', password: 'AdminPassword123!', extra: 'hack' }
    expect(loginBodySchema.safeParse(invalid).success).toBe(false)
  })

  it('valida el DTO de usuario autenticado', () => {
    const user = {
      id: 'usr_1',
      name: 'Admin FIA',
      email: 'admin@fia.com',
      role: 'fia_admin' as const,
      teamId: null,
    }
    expect(authUserSchema.parse(user)).toEqual(user)
  })

  it('valida el DTO de respuesta de sesión', () => {
    const session = {
      user: {
        id: 'usr_2',
        name: 'Staff Ferrari',
        email: 'staff@ferrari.com',
        role: 'team_staff' as const,
        teamId: 'team_1',
      },
      token: 'bearer_token_abc',
    }
    expect(sessionResponseSchema.parse(session)).toEqual(session)
  })
})
