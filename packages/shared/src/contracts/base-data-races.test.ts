import { describe, expect, it } from 'vitest'
import { createRaceBodySchema, raceRoundSchema, raceSchema } from './races'

describe('contratos de carreras', () => {
  const id1 = '00000000-0000-4000-8000-000000000001'
  const id2 = '00000000-0000-4000-8000-000000000002'
  const id3 = '00000000-0000-4000-8000-000000000003'
  const valid = {
    seasonId: id1,
    categoryId: id2,
    circuitId: id3,
    round: 1,
    name: 'Gran Premio de Bahréin',
    date: '2026-03-02T15:00:00.000Z',
  }

  it('valida creación de carrera y recorta nombre', () => {
    expect(createRaceBodySchema.parse({ ...valid, name: ' Gran Premio de Bahréin ' })).toEqual({
      ...valid,
      type: 'grand_prix',
    })
  })

  it('acepta carreras sprint y rechaza tipos desconocidos', () => {
    expect(createRaceBodySchema.parse({ ...valid, type: 'sprint' }).type).toBe('sprint')
    expect(createRaceBodySchema.safeParse({ ...valid, type: 'qualy' }).success).toBe(false)
  })

  it.each([
    [0, 'La ronda debe ser mayor o igual a 1.'],
    [1.5, 'La ronda debe ser un número entero.'],
  ])('rechaza ronda %s con mensaje', (round, message) => {
    expect(raceRoundSchema.safeParse(round).error?.issues[0]?.message).toBe(message)
  })

  it.each([
    [{ ...valid, seasonId: 'inv' }, 'El identificador de temporada debe ser un UUID válido.'],
    [{ ...valid, categoryId: 'inv' }, 'El identificador de categoría debe ser un UUID válido.'],
    [{ ...valid, circuitId: 'inv' }, 'El identificador de circuito debe ser un UUID válido.'],
    [{ ...valid, name: 'A' }, 'El nombre debe tener al menos 2 caracteres.'],
  ])('rechaza carrera inválida %o con mensaje', (body, message) => {
    expect(createRaceBodySchema.safeParse(body).error?.issues[0]?.message).toBe(message)
  })

  it('valida esquema completo de carrera', () => {
    const dto = {
      id: '00000000-0000-4000-8000-000000000010',
      ...valid,
      type: 'sprint',
      resultsRevision: 2,
      version: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    expect(raceSchema.parse(dto)).toEqual(dto)
  })
})
