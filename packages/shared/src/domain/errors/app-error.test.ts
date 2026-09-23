import { describe, expect, it } from 'vitest'
import { AppError, isAppError } from './app-error'
import { ERROR_CATALOG, ERROR_CODES } from './error-catalog'

describe('catálogo de errores', () => {
  it.each(ERROR_CODES)('%s tiene un mensaje claro para el usuario', (code) => {
    expect(ERROR_CATALOG[code].message.length).toBeGreaterThan(20)
    expect(ERROR_CATALOG[code].message.endsWith('.')).toBe(true)
  })

  it('AppError toma status y mensaje del catálogo', () => {
    const error = new AppError('STALE_VERSION')
    expect(error).toMatchObject({ name: 'AppError', status: 409, fields: null })
    expect(error.message).toBe(ERROR_CATALOG.STALE_VERSION.message)
  })

  it('conserva los errores por campo', () => {
    expect(new AppError('VALIDATION_FAILED', { name: ['x'] }).fields).toEqual({ name: ['x'] })
  })

  it('isAppError distingue errores de dominio', () => {
    expect(isAppError(new AppError('FORBIDDEN'))).toBe(true)
    expect(isAppError(new Error('x'))).toBe(false)
  })
})
