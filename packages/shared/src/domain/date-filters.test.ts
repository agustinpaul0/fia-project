import { describe, expect, it } from 'vitest'
import { compareIsoDates, matchesDateCriteria } from './date-filters'

const ISO = '2026-06-10T12:00:00.000Z'

describe('criterios de fecha comunes (US-3)', () => {
  it('aplica temporada y rango, solos y combinados', () => {
    expect(matchesDateCriteria(ISO, {})).toBe(true)
    expect(matchesDateCriteria(ISO, { season: 2026 })).toBe(true)
    expect(matchesDateCriteria(ISO, { season: 2025 })).toBe(false)
    expect(matchesDateCriteria(ISO, { from: '2026-06-10T12:00:00.000Z' })).toBe(true)
    expect(matchesDateCriteria(ISO, { from: '2026-06-11T00:00:00.000Z' })).toBe(false)
    expect(matchesDateCriteria(ISO, { to: '2026-06-10T12:00:00.000Z' })).toBe(true)
    expect(matchesDateCriteria(ISO, { to: '2026-06-09T00:00:00.000Z' })).toBe(false)
    expect(matchesDateCriteria(ISO, { season: 2026, to: '2026-01-01T00:00:00.000Z' })).toBe(false)
  })

  it('ordena descendente salvo que se pida ascendente', () => {
    const dates = ['2026-01-01T00:00:00.000Z', '2026-03-01T00:00:00.000Z']
    expect([...dates].sort(compareIsoDates(undefined))).toEqual([...dates].reverse())
    expect([...dates].sort(compareIsoDates('relevance'))).toEqual([...dates].reverse())
    expect([...dates].sort(compareIsoDates('date_asc'))).toEqual(dates)
  })
})
