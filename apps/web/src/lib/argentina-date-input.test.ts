import { describe, expect, it } from 'vitest'
import { argentinaInputToUtcIso } from './argentina-date-input'

describe('argentinaInputToUtcIso', () => {
  it('interpreta la fecha y hora cargada en horario de Buenos Aires y la pasa a UTC', () => {
    expect(argentinaInputToUtcIso('2026-10-16T14:30')).toBe('2026-10-16T17:30:00.000Z')
  })

  it('deja vacío lo que no se completó', () => {
    expect(argentinaInputToUtcIso('')).toBe('')
  })
})
