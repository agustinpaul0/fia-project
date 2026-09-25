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

  it.each([
    ['TEAM_NOT_FOUND', 404, 'La escudería seleccionada no existe o fue eliminada.'],
    ['STAFF_MEMBER_NOT_FOUND', 404, 'El miembro del personal no existe.'],
    [
      'STAFF_FILE_NUMBER_ALREADY_EXISTS',
      409,
      'Ya existe un miembro del personal con ese número de legajo.',
    ],
    [
      'STAFF_MEMBER_INACTIVE',
      409,
      'Esta cuenta está dada de baja. Creá una cuenta nueva para reemplazarla.',
    ],
  ] as const)('resuelve %s con status %i y mensaje exacto', (code, status, message) => {
    const error = new AppError(code)
    expect(error.status).toBe(status)
    expect(error.message).toBe(message)
  })

  it('isAppError distingue errores de dominio', () => {
    expect(isAppError(new AppError('FORBIDDEN'))).toBe(true)
    expect(isAppError(new Error('x'))).toBe(false)
  })
})
