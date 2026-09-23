import { describe, expect, it } from 'vitest'
import { createSeasonBodySchema, seasonSchema, seasonYearSchema } from './seasons'

describe('contratos de temporadas', () => {
  it('valida creación de temporada correcta y recorta nombre', () => {
    const valid = { year: 2026, name: '  Temporada 2026  ' }
    expect(createSeasonBodySchema.parse(valid)).toEqual({ year: 2026, name: 'Temporada 2026' })
  })

  it.each([
    [1949, 'El año debe ser mayor o igual a 1950.'],
    [2101, 'El año debe ser menor o igual a 2100.'],
    [2024.5, 'El año debe ser un número entero.'],
  ])('rechaza año inválido %s con su mensaje', (year, message) => {
    expect(seasonYearSchema.safeParse(year).error?.issues[0]?.message).toBe(message)
  })

  it('rechaza nombre con longitud menor a 2 con mensaje claro', () => {
    const res = createSeasonBodySchema.safeParse({ year: 2026, name: 'A' })
    expect(res.error?.issues[0]?.message).toBe('El nombre debe tener al menos 2 caracteres.')
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
