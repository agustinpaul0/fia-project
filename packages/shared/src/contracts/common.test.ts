import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { categoryPath } from './api-paths'
import {
  configureSpanishValidation,
  errorResponseSchema,
  idParamsSchema,
  versionQuerySchema,
  versionSchema,
} from './common'
import { healthResponseSchema } from './health'

const UUID = '00000000-0000-4000-8000-000000000001'

describe('contratos comunes', () => {
  it('traduce los mensajes genéricos de Zod al español', () => {
    configureSpanishValidation()
    expect(z.string().safeParse(1).error?.issues[0]?.message).toMatch(/inválid/i)
  })

  it('convierte la versión de la query string a número', () => {
    expect(versionQuerySchema.parse({ version: '3' })).toEqual({ version: 3 })
  })

  it.each([
    [1.5, 'La versión debe ser un número entero.'],
    [0, 'La versión debe ser mayor que cero.'],
  ])('rechaza la versión %s con un mensaje claro', (version, message) => {
    expect(versionSchema.safeParse(version).error?.issues[0]?.message).toBe(message)
  })

  it('acepta ids UUID y rechaza el resto con un mensaje claro', () => {
    expect(idParamsSchema.parse({ id: UUID })).toEqual({ id: UUID })
    expect(idParamsSchema.safeParse({ id: '1' }).error?.issues[0]?.message).toBe(
      'El identificador no es válido.',
    )
  })

  it('valida el formato de error', () => {
    const error = { code: 'STALE_VERSION', message: 'Mensaje largo', fields: null }
    expect(errorResponseSchema.safeParse({ error }).success).toBe(true)
    expect(errorResponseSchema.safeParse({ error: { ...error, code: 'X' } }).success).toBe(false)
    expect(errorResponseSchema.safeParse({ error: { ...error, message: '' } }).success).toBe(false)
  })

  it('valida la respuesta de salud', () => {
    expect(healthResponseSchema.parse({ status: 'ok', database: 'up' }).database).toBe('up')
    expect(healthResponseSchema.parse({ status: 'ok', database: 'down' }).database).toBe('down')
    expect(healthResponseSchema.safeParse({ status: 'ok', database: 'x' }).success).toBe(false)
    expect(healthResponseSchema.safeParse({ status: 'ko', database: 'up' }).success).toBe(false)
  })

  it('arma la ruta de una categoría', () => {
    expect(categoryPath('abc')).toBe('/categories/abc')
  })
})
