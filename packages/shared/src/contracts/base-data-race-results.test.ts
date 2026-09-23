import { describe, expect, it } from 'vitest'
import {
  createRaceResultBodySchema,
  racePointsSchema,
  racePositionSchema,
  raceResultSchema,
} from './race-results'

describe('contratos de resultados de carrera', () => {
  const rId = '00000000-0000-4000-8000-000000000001'
  const dId = '00000000-0000-4000-8000-000000000002'
  const tId = '00000000-0000-4000-8000-000000000003'
  const valid = { raceId: rId, driverId: dId, teamId: tId, position: 1, points: 25 }

  it('valida creación de resultado con puntos', () => {
    expect(createRaceResultBodySchema.parse(valid)).toEqual(valid)
  })

  it.each([
    [0, 'La posición debe ser mayor o igual a 1.'],
    [1.5, 'La posición debe ser un número entero.'],
  ])('rechaza posición %s con mensaje', (pos, message) => {
    expect(racePositionSchema.safeParse(pos).error?.issues[0]?.message).toBe(message)
  })

  it.each([
    [-1, 'Los puntos deben ser mayores o iguales a 0.'],
    [1.5, 'Los puntos deben ser un número entero.'],
  ])('rechaza puntos %s con mensaje', (pts, message) => {
    expect(racePointsSchema.safeParse(pts).error?.issues[0]?.message).toBe(message)
  })

  it.each([
    [{ ...valid, raceId: 'inv' }, 'El identificador de carrera debe ser un UUID válido.'],
    [{ ...valid, driverId: 'inv' }, 'El identificador de piloto debe ser un UUID válido.'],
    [{ ...valid, teamId: 'inv' }, 'El identificador de equipo debe ser un UUID válido.'],
  ])('rechaza FKs inválidas %o con mensaje', (body, message) => {
    expect(createRaceResultBodySchema.safeParse(body).error?.issues[0]?.message).toBe(message)
  })

  it('valida esquema completo de resultado', () => {
    const dto = {
      id: '00000000-0000-4000-8000-000000000099',
      ...valid,
      version: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    expect(raceResultSchema.parse(dto)).toEqual(dto)
  })
})
