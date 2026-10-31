import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { createDriverAccountBodySchema, updateDriverAccountBodySchema } from './driver-accounts'

const VALID = {
  driverId: '00000000-0000-4000-8000-000000000020',
  email: 'leclerc@ferrari.com',
  password: 'Password123!',
  name: 'Charles Leclerc',
}

const firstMessage = (input: unknown): string | undefined =>
  createDriverAccountBodySchema.safeParse(input).error?.issues[0]?.message

describe('contrato de cuentas oficiales de pilotos (US-27)', () => {
  it('acepta un alta válida y normaliza nombre y mail', () => {
    const input = { ...VALID, name: ' Charles Leclerc ', email: ' LECLERC@FERRARI.COM ' }
    expect(createDriverAccountBodySchema.parse(input)).toEqual(VALID)
  })

  it('rechaza un piloto que no es UUID', () => {
    expect(firstMessage({ ...VALID, driverId: 'x' })).toBe('Elegí un piloto válido.')
  })

  it('rechaza un nombre demasiado corto', () => {
    expect(firstMessage({ ...VALID, name: 'A' })).toBe(
      'El nombre debe tener al menos 2 caracteres.',
    )
  })

  it('rechaza campos desconocidos como el rol', () => {
    expect(createDriverAccountBodySchema.safeParse({ ...VALID, role: 'fia_admin' }).success).toBe(
      false,
    )
  })

  it('la edición exige versión', () => {
    expect(updateDriverAccountBodySchema.safeParse({ name: 'Charles' }).success).toBe(false)
    expect(updateDriverAccountBodySchema.parse({ name: 'Charles', version: 2 })).toEqual({
      name: 'Charles',
      version: 2,
    })
  })

  it('safeParse nunca lanza con entradas arbitrarias', () => {
    fc.assert(
      fc.property(fc.anything(), (input) => {
        expect(() => createDriverAccountBodySchema.safeParse(input)).not.toThrow()
        expect(() => updateDriverAccountBodySchema.safeParse(input)).not.toThrow()
      }),
    )
  })
})
