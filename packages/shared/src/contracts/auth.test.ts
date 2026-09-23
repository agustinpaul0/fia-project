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

  it('rechaza un correo electrónico con formato inválido con mensaje', () => {
    const res = loginBodySchema.safeParse({ email: 'invalido', password: 'AdminPassword123!' })
    expect(res.error?.issues[0]?.message).toBe('Ingresá un correo electrónico válido.')
  })

  it('exige contraseña obligatoria no vacía', () => {
    const res = loginBodySchema.safeParse({ email: 'admin@fia.com', password: '' })
    expect(res.error?.issues[0]?.message).toBe('Ingresá tu contraseña.')
  })

  it('rechaza contraseñas según longitud y mensaje', () => {
    const resMin = passwordSchema.safeParse('Corta1!')
    expect(resMin.error?.issues[0]?.message).toBe(
      'La contraseña debe tener al menos 12 caracteres.',
    )
    const resMax = passwordSchema.safeParse('A1a'.repeat(45))
    expect(resMax.error?.issues[0]?.message).toBe(
      'La contraseña no puede superar los 128 caracteres.',
    )
  })

  it('rechaza contraseñas sin mayúsculas, minúsculas o números con mensaje', () => {
    const msg = 'La contraseña debe incluir mayúscula, minúscula y número.'
    expect(passwordSchema.safeParse('solominusculas123').error?.issues[0]?.message).toBe(msg)
    expect(passwordSchema.safeParse('SOLOMAYUSCULAS123').error?.issues[0]?.message).toBe(msg)
    expect(passwordSchema.safeParse('SinNumerosMayusYMinus').error?.issues[0]?.message).toBe(msg)
  })

  it('acepta contraseñas robustas que cumplen la política', () => {
    expect(passwordSchema.safeParse('AdminPassword123!').success).toBe(true)
  })

  it('rechaza campos desconocidos en el cuerpo de login', () => {
    const invalid = { email: 'admin@fia.com', password: 'AdminPassword123!', extra: 'hack' }
    expect(loginBodySchema.safeParse(invalid).success).toBe(false)
  })

  it('valida el DTO de usuario autenticado y respuesta de sesión', () => {
    const user = {
      id: 'usr_1',
      name: 'Admin',
      email: 'a@f.com',
      role: 'fia_admin' as const,
      teamId: null,
    }
    expect(authUserSchema.parse(user)).toEqual(user)
    const session = { user, token: 'token123' }
    expect(sessionResponseSchema.parse(session)).toEqual(session)
  })
})
