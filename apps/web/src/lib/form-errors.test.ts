import { AppError } from '@fia/shared/domain'
import { describe, expect, it, vi } from 'vitest'
import { applyServerErrors, toServerFormError } from './form-errors'

describe('errores de formulario del servidor', () => {
  it('toma el primer mensaje de cada campo', () => {
    const error = new AppError('VALIDATION_FAILED', {
      password: ['Corta', 'Sin número'],
      email: [],
    })
    expect(toServerFormError(error, 'x')).toEqual({
      message: 'Hay datos inválidos. Revisá los campos marcados y volvé a intentar.',
      fields: { password: 'Corta' },
    })
  })

  it('asocia el email o el legajo repetido a su campo', () => {
    const email = new AppError('USER_ALREADY_EXISTS')
    expect(toServerFormError(email, 'x').fields).toEqual({ email: email.message })
    const file = new AppError('STAFF_FILE_NUMBER_ALREADY_EXISTS')
    expect(toServerFormError(file, 'x').fields).toEqual({ fileNumber: file.message })
    expect(toServerFormError(new AppError('FORBIDDEN'), 'x').fields).toEqual({})
  })

  it('usa el mensaje del Error común o el genérico', () => {
    expect(toServerFormError(new Error('Caída'), 'Genérico')).toEqual({
      message: 'Caída',
      fields: {},
    })
    expect(toServerFormError('texto', 'Genérico')).toEqual({ message: 'Genérico', fields: {} })
  })

  it('marca sólo los campos del formulario y no repite el mensaje general', () => {
    const setError = vi.fn()
    const error = new AppError('VALIDATION_FAILED', { phoneNumber: ['Mal'], _form: ['General'] })
    const message = applyServerErrors(setError, {
      error,
      fallback: 'x',
      names: ['phoneNumber', 'email'],
    })
    expect(setError).toHaveBeenCalledOnce()
    expect(setError).toHaveBeenCalledWith('phoneNumber', { type: 'server', message: 'Mal' })
    expect(message).toBeNull()
  })

  it('devuelve el mensaje general si ningún campo del formulario quedó marcado', () => {
    const error = new AppError('VALIDATION_FAILED', { _form: ['General'] })
    expect(applyServerErrors(vi.fn(), { error, fallback: 'x', names: ['email'] })).toBe(
      error.message,
    )
  })
})
