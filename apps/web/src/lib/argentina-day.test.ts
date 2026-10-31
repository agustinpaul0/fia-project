import { describe, expect, it } from 'vitest'
import {
  dayEndIso,
  dayStartIso,
  fromArgentinaLocalInput,
  toArgentinaLocalInput,
} from './argentina-day'

describe('días en hora de Buenos Aires', () => {
  it('convierte el día elegido a su inicio y fin en UTC', () => {
    expect(dayStartIso('2026-06-10')).toBe('2026-06-10T03:00:00.000Z')
    expect(dayEndIso('2026-06-10')).toBe('2026-06-11T02:59:59.999Z')
  })
})

describe('fecha y hora del evento en hora argentina', () => {
  it('ida y vuelta entre UTC y el valor del input', () => {
    expect(toArgentinaLocalInput('2026-06-07T18:00:00.000Z')).toBe('2026-06-07T15:00')
    expect(fromArgentinaLocalInput('2026-06-07T15:00')).toBe('2026-06-07T18:00:00.000Z')
    expect(fromArgentinaLocalInput('')).toBeNull()
    expect(fromArgentinaLocalInput('2026-13-45T99:99')).toBeNull()
  })
})
