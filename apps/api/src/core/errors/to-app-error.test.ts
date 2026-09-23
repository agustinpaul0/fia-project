import { AppError } from '@fia/shared/domain'
import { HTTPException } from 'hono/http-exception'
import { describe, expect, it } from 'vitest'
import { toAppError } from './to-app-error'

describe('toAppError', () => {
  it.each([
    [400, 'VALIDATION_FAILED'],
    [401, 'UNAUTHENTICATED'],
    [403, 'FORBIDDEN'],
    [404, 'ROUTE_NOT_FOUND'],
    [413, 'PAYLOAD_TOO_LARGE'],
    [429, 'RATE_LIMITED'],
  ] as const)('traduce HTTP %i a %s', (status, code) => {
    expect(toAppError(new HTTPException(status))?.code).toBe(code)
  })

  it('devuelve el mismo AppError', () => {
    const error = new AppError('FORBIDDEN')
    expect(toAppError(error)).toBe(error)
  })

  it('devuelve null para errores desconocidos', () => {
    expect(toAppError(new Error('x'))).toBeNull()
    expect(toAppError({ status: 400 })).toBeNull()
  })
})
