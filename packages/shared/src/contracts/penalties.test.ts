import { describe, expect, it } from 'vitest'
import {
  createPenaltyBodySchema,
  penaltiesQuerySchema,
  penaltyListSchema,
  penaltySchema,
  penaltyTypeSchema,
} from './penalties'

describe('contratos de sanciones (penalties)', () => {
  const valid = {
    teamId: '00000000-0000-4000-8000-000000000001',
    driverId: '00000000-0000-4000-8000-000000000002',
    raceId: '00000000-0000-4000-8000-000000000003',
    type: 'time_penalty' as const,
    penalty: '5 segundos de recargo',
    reason: 'Exceder los límites de pista en curva 4 reiteradamente.',
  }

  it('valida el alta de una sanción válida para un piloto', () => {
    const parsed = createPenaltyBodySchema.parse(valid)
    expect(parsed.penalty).toBe('5 segundos de recargo')
    expect(parsed.driverId).toBe(valid.driverId)
  })

  it('permite alta de sanción directa a escudería sin piloto', () => {
    const parsed = createPenaltyBodySchema.parse({
      ...valid,
      driverId: null,
      type: 'fine',
      penalty: 'Multa de 5.000 EUR',
      reason: 'Infracción de personal en calle de boxes.',
    })
    expect(parsed.driverId).toBeNull()
  })

  it('rechaza tipos de penalización no válidos', () => {
    expect(penaltyTypeSchema.safeParse('invalido').success).toBe(false)
  })

  it('rechaza si falta motivo o si es menor a 5 caracteres', () => {
    const res = createPenaltyBodySchema.safeParse({ ...valid, reason: 'Oops' })
    expect(res.success).toBe(false)
  })

  it('valida DTO completo de sanción con nombres asociados', () => {
    const full = {
      id: '00000000-0000-4000-8000-000000000010',
      ...valid,
      teamName: 'Ferrari',
      driverName: 'Charles Leclerc',
      raceName: 'GP de Mónaco',
      issuedAt: '2026-05-24T14:30:00.000Z',
      version: 1,
      createdAt: '2026-05-24T14:35:00.000Z',
    }
    const parsed = penaltySchema.parse(full)
    expect(parsed.id).toBe(full.id)
    expect(parsed.teamName).toBe('Ferrari')
    expect(penaltyListSchema.parse([parsed])).toHaveLength(1)
  })

  it('valida filtros de consulta de sanciones', () => {
    const query = penaltiesQuerySchema.parse({ season: '2026', type: 'time_penalty' })
    expect(query.season).toBe(2026)
    expect(query.type).toBe('time_penalty')
  })
})
