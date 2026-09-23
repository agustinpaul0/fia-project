import { describe, expect, it } from 'vitest'
import { formatDate, formatDateTime } from './format-date-time'

describe('formato de fechas en hora argentina', () => {
  it('convierte un instante UTC a la hora de Buenos Aires', () => {
    expect(formatDateTime('2026-10-06T18:00:00.000Z')).toBe('6/10/26, 15:00')
  })

  it('cambia de día si en Argentina todavía es el día anterior', () => {
    expect(formatDate('2026-10-07T02:30:00.000Z')).toBe('6 de octubre de 2026')
  })
})
