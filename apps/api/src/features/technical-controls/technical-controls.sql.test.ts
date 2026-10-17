import { describe, expect, it } from 'vitest'
import { buildFilterConditions } from './technical-controls.sql'

describe('buildFilterConditions', () => {
  const activeAt = new Date('2026-10-16T12:00:00.000Z')

  it('siempre filtra por vigencia aunque no haya otros filtros', () => {
    expect(buildFilterConditions({ activeAt })).toHaveLength(1)
  })

  it('construye condiciones para cada filtro presente', () => {
    const conditions = buildFilterConditions({
      teamId: '00000000-0000-4000-8000-000000000010',
      controlType: 'dimensions',
      status: 'passed',
      season: 2026,
      activeAt,
    })
    expect(conditions).toHaveLength(6)
  })
})
