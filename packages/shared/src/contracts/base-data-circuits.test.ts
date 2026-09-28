import { describe, expect, it } from 'vitest'
import { circuitSchema, createCircuitBodySchema } from './circuits'

describe('contratos de circuitos', () => {
  const valid = {
    name: 'Monza',
    country: 'Italia',
    city: 'Monza',
    lengthKm: '5.793',
  }

  it('valida creación de circuito correcto y recorta espacios', () => {
    const input = {
      name: ' Monza ',
      country: ' Italia ',
      city: ' Monza ',
      lengthKm: '5.793',
    }
    expect(createCircuitBodySchema.parse(input)).toEqual(valid)
  })

  it.each([
    [{ ...valid, name: 'A' }, 'El nombre debe tener al menos 2 caracteres.'],
    [{ ...valid, country: 'A' }, 'El país debe tener al menos 2 caracteres.'],
    [{ ...valid, city: 'A' }, 'La ciudad debe tener al menos 2 caracteres.'],
    [{ ...valid, lengthKm: '5.7' }, 'La longitud debe tener formato X.XXX km.'],
  ])('rechaza circuito inválido %o con mensaje específico', (body, message) => {
    expect(createCircuitBodySchema.safeParse(body).error?.issues[0]?.message).toBe(message)
  })

  it('valida esquema completo de circuito', () => {
    const dto = {
      id: '00000000-0000-4000-8000-000000000002',
      ...valid,
      version: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    expect(circuitSchema.parse(dto)).toEqual(dto)
  })
})
