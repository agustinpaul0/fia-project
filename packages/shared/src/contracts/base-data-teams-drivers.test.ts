import { describe, expect, it } from 'vitest'
import { createDriverBodySchema, driverSchema } from './drivers'
import { createTeamBodySchema, teamSchema } from './teams'

describe('contratos de equipos', () => {
  const catId = '00000000-0000-4000-8000-000000000001'

  it('valida creación de equipo', () => {
    const valid = { name: 'Ferrari', country: 'Italia', categoryId: catId }
    expect(createTeamBodySchema.parse(valid)).toEqual(valid)
  })

  it('valida esquema completo de equipo', () => {
    const dto = {
      id: '00000000-0000-4000-8000-000000000002',
      name: 'Ferrari',
      country: 'Italia',
      categoryId: catId,
      version: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    expect(teamSchema.parse(dto)).toEqual(dto)
  })
})

describe('contratos de pilotos', () => {
  it('valida creación de piloto con defaults', () => {
    const valid = {
      firstName: 'Charles',
      lastName: 'Leclerc',
      code: 'LEC',
      number: 16,
      country: 'Mónaco',
    }
    const parsed = createDriverBodySchema.parse(valid)
    expect(parsed.role).toBe('main')
    expect(parsed.code).toBe('LEC')
  })

  it('rechaza código de piloto que no cumple 3 mayúsculas', () => {
    expect(
      createDriverBodySchema.safeParse({
        firstName: 'Charles',
        lastName: 'Leclerc',
        code: 'lec',
        number: 16,
        country: 'Mónaco',
      }).success,
    ).toBe(false)
  })

  it('rechaza número fuera de 1 a 99', () => {
    expect(
      createDriverBodySchema.safeParse({
        firstName: 'Charles',
        lastName: 'Leclerc',
        code: 'LEC',
        number: 100,
        country: 'Mónaco',
      }).success,
    ).toBe(false)
  })

  it('valida esquema completo de piloto', () => {
    const dto = {
      id: '00000000-0000-4000-8000-000000000003',
      firstName: 'Charles',
      lastName: 'Leclerc',
      code: 'LEC',
      number: 16,
      country: 'Mónaco',
      teamId: null,
      role: 'main' as const,
      version: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    expect(driverSchema.parse(dto)).toEqual(dto)
  })
})
