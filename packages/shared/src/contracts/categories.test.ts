import { beforeAll, describe, expect, it } from 'vitest'
import { categorySchema, createCategoryBodySchema, updateCategoryBodySchema } from './categories'
import { configureSpanishValidation } from './common'

const VALID = { name: '  Fórmula 1  ', code: 'F1' }

const firstMessage = (input: unknown): string | undefined =>
  createCategoryBodySchema.safeParse(input).error?.issues[0]?.message

describe('contratos de categorías', () => {
  beforeAll(() => {
    configureSpanishValidation()
  })

  it('acepta un cuerpo válido y recorta espacios', () => {
    expect(createCategoryBodySchema.parse(VALID)).toEqual({ name: 'Fórmula 1', code: 'F1' })
  })

  it.each([
    [{ ...VALID, name: 'X' }, 'El nombre debe tener al menos 2 caracteres.'],
    [{ ...VALID, name: 'x'.repeat(61) }, 'El nombre no puede superar los 60 caracteres.'],
    [{ ...VALID, code: 'f1' }, 'El código debe tener entre 2 y 10 letras mayúsculas o números.'],
    [{ ...VALID, code: 'aF1' }, 'El código debe tener entre 2 y 10 letras mayúsculas o números.'],
    [{ ...VALID, code: 'F1a' }, 'El código debe tener entre 2 y 10 letras mayúsculas o números.'],
  ])('rechaza %o con un mensaje claro', (body, message) => {
    expect(firstMessage(body)).toBe(message)
  })

  it('recorta espacios del código antes de validarlo', () => {
    expect(createCategoryBodySchema.parse({ ...VALID, code: ' F2 ' }).code).toBe('F2')
  })

  it('rechaza campos desconocidos', () => {
    expect(createCategoryBodySchema.safeParse({ ...VALID, extra: 1 }).success).toBe(false)
  })

  it('exige una versión entera positiva para actualizar', () => {
    expect(updateCategoryBodySchema.safeParse({ ...VALID, version: 0 }).success).toBe(false)
    expect(updateCategoryBodySchema.safeParse({ ...VALID, version: 1.5 }).success).toBe(false)
    expect(updateCategoryBodySchema.safeParse({ ...VALID, version: 2 }).success).toBe(true)
  })
})

describe('contrato de respuesta de categoría', () => {
  const dto = {
    id: '00000000-0000-4000-8000-000000000001',
    name: 'Fórmula 1',
    code: 'F1',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }

  it('acepta un DTO completo', () => {
    expect(categorySchema.parse(dto)).toEqual(dto)
  })

  it.each(['id', 'name', 'code', 'version', 'createdAt', 'updatedAt'])('exige %s', (field) => {
    expect(categorySchema.safeParse({ ...dto, [field]: undefined }).success).toBe(false)
  })

  it('rechaza campos internos que no deben filtrarse', () => {
    expect(categorySchema.safeParse({ ...dto, passwordHash: 'x' }).success).toBe(false)
  })
})
