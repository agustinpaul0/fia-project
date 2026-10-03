import type { RaceSummary } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import { racesToPublish } from './demo-results'
import { DEMO_STAFF, teamIdFor } from './demo-staff'

const race = (id: string, overrides: Partial<RaceSummary> = {}): RaceSummary => ({
  id,
  name: `Carrera ${id}`,
  type: 'grand_prix',
  round: 1,
  date: '2025-03-16T05:00:00.000Z',
  seasonYear: 2025,
  categoryCode: 'F1',
  circuitName: 'Circuito',
  version: 1,
  resultsRevision: 0,
  winnerName: 'Piloto',
  ...overrides,
})

describe('datos de la demo', () => {
  it('publica las dos últimas carreras con resultado que todavía no se publicaron', () => {
    const races = [race('a'), race('b'), race('c'), race('d', { winnerName: null })]
    expect(racesToPublish(races).map((r) => r.id)).toEqual(['b', 'c'])
  })

  it('completa hasta dos publicadas y no repite si ya hay suficientes', () => {
    expect(racesToPublish([race('a'), race('b', { resultsRevision: 1 })]).map((r) => r.id)).toEqual(
      ['a'],
    )
    const done = [race('a', { resultsRevision: 1 }), race('b', { resultsRevision: 2 }), race('c')]
    expect(racesToPublish(done)).toEqual([])
  })

  it('encuentra la escudería por una parte de su nombre', () => {
    const teams = [
      { id: '1', name: 'Scuderia Ferrari' },
      { id: '2', name: 'McLaren F1 Team' },
    ]
    expect(teamIdFor(teams, 'ferrari')).toBe('1')
    expect(teamIdFor(teams, 'McLaren')).toBe('2')
    expect(teamIdFor(teams, 'Williams')).toBeNull()
  })

  it('define cuentas de demo con emails y legajos únicos', () => {
    expect(new Set(DEMO_STAFF.map((p) => p.email)).size).toBe(DEMO_STAFF.length)
    expect(new Set(DEMO_STAFF.map((p) => p.fileNumber)).size).toBe(DEMO_STAFF.length)
  })
})
