import { describe, expect, it } from 'vitest'
import { applyClientFilters } from '../domain/filters'
import { commonFiltersQuerySchema } from './common-filters'

describe('commonFiltersQuerySchema y applyClientFilters (US-3)', () => {
  it('valida parámetros de filtro individuales y combinados y rechaza rangos invertidos', () => {
    const valid = commonFiltersQuerySchema.safeParse({
      season: '2026',
      from: '2026-01-01T00:00:00.000Z',
      to: '2026-12-31T23:59:59.000Z',
      sort: 'relevance',
    })
    expect(valid.success).toBe(true)

    const invalid = commonFiltersQuerySchema.safeParse({
      from: '2026-12-31T23:59:59.000Z',
      to: '2026-01-01T00:00:00.000Z',
    })
    expect(invalid.success).toBe(false)
  })

  it('filtra por temporada, escudería y tipo de control y ordena por relevancia', () => {
    const items = [
      { id: '1', date: '2025-05-01T12:00:00.000Z', teamId: 't1', controlType: 'weight' },
      { id: '2', date: '2026-06-10T12:00:00.000Z', teamId: 't1', controlType: 'fuel' },
      { id: '3', date: '2026-06-01T12:00:00.000Z', teamId: 't2', controlType: 'weight' },
    ]
    const bySeasonAndTeam = applyClientFilters(items, { season: 2026, teamId: 't1' })
    expect(bySeasonAndTeam.map((i) => i.id)).toEqual(['2'])

    const byRelevance = applyClientFilters(
      items,
      { sort: 'relevance' },
      new Date('2026-06-02T00:00:00.000Z'),
    )
    expect(byRelevance[0]?.id).toBe('3')
  })
})
