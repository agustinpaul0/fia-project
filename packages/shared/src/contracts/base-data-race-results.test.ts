import { describe, expect, it } from 'vitest'
import { createRaceResultBodySchema, raceResultSchema } from './race-results'

describe('contratos de resultados de carrera', () => {
  const rId = '00000000-0000-4000-8000-000000000001'
  const dId = '00000000-0000-4000-8000-000000000002'
  const tId = '00000000-0000-4000-8000-000000000003'

  it('valida creación de resultado con puntos', () => {
    const valid = {
      raceId: rId,
      driverId: dId,
      teamId: tId,
      position: 1,
      points: 25,
    }
    expect(createRaceResultBodySchema.parse(valid)).toEqual(valid)
  })

  it('rechaza posición menor a 1 o puntos negativos', () => {
    expect(
      createRaceResultBodySchema.safeParse({
        raceId: rId,
        driverId: dId,
        teamId: tId,
        position: 0,
        points: 25,
      }).success,
    ).toBe(false)
    expect(
      createRaceResultBodySchema.safeParse({
        raceId: rId,
        driverId: dId,
        teamId: tId,
        position: 1,
        points: -5,
      }).success,
    ).toBe(false)
  })

  it('valida esquema completo de resultado', () => {
    const dto = {
      id: '00000000-0000-4000-8000-000000000099',
      raceId: rId,
      driverId: dId,
      teamId: tId,
      position: 1,
      points: 25,
      version: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    expect(raceResultSchema.parse(dto)).toEqual(dto)
  })
})
