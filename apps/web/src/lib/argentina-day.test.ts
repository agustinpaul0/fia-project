import { describe, expect, it } from 'vitest'
import { dayEndIso, dayStartIso } from './argentina-day'

describe('días en hora de Buenos Aires', () => {
  it('convierte el día elegido a su inicio y fin en UTC', () => {
    expect(dayStartIso('2026-06-10')).toBe('2026-06-10T03:00:00.000Z')
    expect(dayEndIso('2026-06-10')).toBe('2026-06-11T02:59:59.999Z')
  })
})
