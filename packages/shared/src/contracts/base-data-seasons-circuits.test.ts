import { describe, expect, it } from 'vitest'
import { circuitSchema, createCircuitBodySchema } from './circuits'
import { createSeasonBodySchema, seasonSchema } from './seasons'

describe('contratos de temporadas', () => {
  it('valida creación de temporada correcta', () => {
    const valid = { year: 2026, name: 'Temporada 2026' }
    expect(createSeasonBodySchema.parse(valid)).toEqual(valid)
  })

  it('rechaza años inválidos', () => {
    expect(createSeasonBodySchema.safeParse({ year: 1940, name: 'A' }).success).toBe(false)
    expect(createSeasonBodySchema.safeParse({ year: 2150, name: 'A' }).success).toBe(false)
  })

  it('valida esquema completo de temporada', () => {
    const dto = {
      id: '00000000-0000-4000-8000-000000000001',
      year: 2026,
      name: 'Temporada 2026',
      version: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    expect(seasonSchema.parse(dto)).toEqual(dto)
  })
})

describe('contratos de circuitos', () => {
  it('valida creación de circuito correcto', () => {
    const valid = {
      name: 'Monza',
      country: 'Italia',
      city: 'Monza',
      lengthKm: '5.793',
    }
    expect(createCircuitBodySchema.parse(valid)).toEqual(valid)
  })

  it('rechaza formato inválido de longitud en km', () => {
    const invalid = {
      name: 'Monza',
      country: 'Italia',
      city: 'Monza',
      lengthKm: '5.7',
    }
    expect(createCircuitBodySchema.safeParse(invalid).success).toBe(false)
  })

  it('valida esquema completo de circuito', () => {
    const dto = {
      id: '00000000-0000-4000-8000-000000000002',
      name: 'Monza',
      country: 'Italia',
      city: 'Monza',
      lengthKm: '5.793',
      version: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    expect(circuitSchema.parse(dto)).toEqual(dto)
  })
})
