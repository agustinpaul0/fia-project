import { describe, expect, it } from 'vitest'
import { createRaceBodySchema, raceSchema } from './races'

describe('contratos de carreras', () => {
  const id1 = '00000000-0000-4000-8000-000000000001'
  const id2 = '00000000-0000-4000-8000-000000000002'
  const id3 = '00000000-0000-4000-8000-000000000003'

  it('valida creación de carrera', () => {
    const valid = {
      seasonId: id1,
      categoryId: id2,
      circuitId: id3,
      round: 1,
      name: 'Gran Premio de Bahréin',
      date: '2026-03-02T15:00:00.000Z',
    }
    expect(createRaceBodySchema.parse(valid)).toEqual(valid)
  })

  it('rechaza ronda menor a 1', () => {
    expect(
      createRaceBodySchema.safeParse({
        seasonId: id1,
        categoryId: id2,
        circuitId: id3,
        round: 0,
        name: 'GP',
        date: '2026-03-02T15:00:00.000Z',
      }).success,
    ).toBe(false)
  })

  it('valida esquema completo de carrera', () => {
    const dto = {
      id: '00000000-0000-4000-8000-000000000010',
      seasonId: id1,
      categoryId: id2,
      circuitId: id3,
      round: 1,
      name: 'Gran Premio de Bahréin',
      date: '2026-03-02T15:00:00.000Z',
      version: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    expect(raceSchema.parse(dto)).toEqual(dto)
  })
})
