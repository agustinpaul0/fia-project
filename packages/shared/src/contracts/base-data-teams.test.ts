import { describe, expect, it } from 'vitest'
import { createTeamBodySchema, teamOptionListSchema, teamOptionSchema, teamSchema } from './teams'

describe('contratos de equipos', () => {
  const catId = '00000000-0000-4000-8000-000000000001'
  const valid = { name: 'Ferrari', country: 'Italia', categoryId: catId }

  it('valida creación de equipo y recorta espacios', () => {
    const input = { name: ' Ferrari ', country: ' Italia ', categoryId: catId }
    expect(createTeamBodySchema.parse(input)).toEqual(valid)
  })

  it.each([
    [{ ...valid, name: 'A' }, 'El nombre debe tener al menos 2 caracteres.'],
    [{ ...valid, country: 'A' }, 'El país debe tener al menos 2 caracteres.'],
    [
      { ...valid, categoryId: 'invalido' },
      'El identificador de categoría debe ser un UUID válido.',
    ],
  ])('rechaza equipo inválido %o con mensaje específico', (body, message) => {
    expect(createTeamBodySchema.safeParse(body).error?.issues[0]?.message).toBe(message)
  })

  it('valida esquema completo de equipo', () => {
    const dto = {
      id: '00000000-0000-4000-8000-000000000002',
      ...valid,
      version: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    expect(teamSchema.parse(dto)).toEqual(dto)
  })

  it('valida opción mínima de equipo para selectores', () => {
    const option = { id: '00000000-0000-4000-8000-000000000002', name: 'Ferrari' }
    expect(teamOptionSchema.parse(option)).toEqual(option)
    expect(teamOptionListSchema.parse([option])).toEqual([option])
    expect(teamOptionSchema.safeParse({ id: 'invalido', name: 'Ferrari' }).success).toBe(false)
    expect(teamOptionSchema.safeParse({ ...option, extra: 1 }).success).toBe(false)
  })
})
