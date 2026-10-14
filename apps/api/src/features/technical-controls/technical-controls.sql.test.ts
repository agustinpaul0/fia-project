import { describe, expect, it } from 'vitest'
import { buildFilterConditions } from './technical-controls.sql'

describe('buildFilterConditions', () => {
  it('retorna arreglo vacío si no hay filtros', () => {
    const conditions = buildFilterConditions({})
    expect(conditions).toHaveLength(0)
  })

  it('construye condiciones para cada filtro presente', () => {
    const conditions = buildFilterConditions({
      teamId: '00000000-0000-4000-8000-000000000010',
      controlType: 'dimensions',
      status: 'passed',
      season: 2026,
    })
    expect(conditions.length).toBeGreaterThanOrEqual(4)
  })
})
