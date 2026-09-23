import { describe, expect, it } from 'vitest'
import {
  createDriverBodySchema,
  driverCodeSchema,
  driverNumberSchema,
  driverRoleSchema,
  driverSchema,
} from './drivers'

describe('contratos de pilotos', () => {
  const valid = {
    firstName: 'Charles',
    lastName: 'Leclerc',
    code: 'LEC',
    number: 16,
    country: 'Mónaco',
  }

  it('valida creación de piloto con defaults y recorta cadenas', () => {
    const input = {
      firstName: ' Charles ',
      lastName: ' Leclerc ',
      code: ' LEC ',
      number: 16,
      country: ' Mónaco ',
    }
    const parsed = createDriverBodySchema.parse(input)
    expect(parsed).toEqual({ ...valid, role: 'main' })
  })

  it('valida roles válidos de piloto', () => {
    expect(driverRoleSchema.parse('main')).toBe('main')
    expect(driverRoleSchema.parse('reserve')).toBe('reserve')
    expect(driverRoleSchema.safeParse('').success).toBe(false)
  })

  it('rechaza código con formato inválido con mensaje', () => {
    const res = driverCodeSchema.safeParse('lec')
    expect(res.error?.issues[0]?.message).toBe(
      'El código debe contener exactamente 3 letras mayúsculas.',
    )
  })

  it.each([
    [1.5, 'El número debe ser un entero.'],
    [0, 'El número de piloto debe estar entre 1 y 99.'],
    [100, 'El número de piloto debe estar entre 1 y 99.'],
  ])('rechaza dorsal %s con mensaje', (num, message) => {
    expect(driverNumberSchema.safeParse(num).error?.issues[0]?.message).toBe(message)
  })

  it.each([
    [{ ...valid, firstName: 'A' }, 'El nombre debe tener al menos 2 caracteres.'],
    [{ ...valid, lastName: 'A' }, 'El apellido debe tener al menos 2 caracteres.'],
    [{ ...valid, country: 'A' }, 'El país debe tener al menos 2 caracteres.'],
    [{ ...valid, teamId: 'invalido' }, 'El identificador de equipo debe ser un UUID válido.'],
  ])('rechaza piloto inválido %o con mensaje', (body, message) => {
    expect(createDriverBodySchema.safeParse(body).error?.issues[0]?.message).toBe(message)
  })

  it('valida esquema completo de piloto', () => {
    const dto = {
      id: '00000000-0000-4000-8000-000000000003',
      ...valid,
      teamId: null,
      role: 'main' as const,
      version: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    expect(driverSchema.parse(dto)).toEqual(dto)
  })
})
