import { describe, expect, it } from 'vitest'
import { seasonBounds } from './filter-conditions'

describe('filtros comunes (US-3)', () => {
  it('la temporada abarca el año UTC completo', () => {
    const { start, end } = seasonBounds(2026)
    expect(start.toISOString()).toBe('2026-01-01T00:00:00.000Z')
    expect(end.toISOString()).toBe('2026-12-31T23:59:59.999Z')
  })
})
