import { describe, expect, it } from 'vitest'
import {
  createTechnicalControlBodySchema,
  technicalControlSchema,
  technicalControlsQuerySchema,
} from './technical-controls'

describe('technical-controls contracts', () => {
  const validUuid = '11111111-1111-4111-8111-111111111111'
  const validBody = {
    teamId: validUuid,
    driverId: validUuid,
    carNumber: 44,
    raceId: validUuid,
    controlType: 'weight' as const,
    status: 'passed' as const,
    notes: 'Peso dentro del límite reglamentario.',
    inspectedAt: '2026-10-14T12:00:00.000Z',
    expiresAt: '2026-10-14T18:00:00.000Z',
  }

  it('valida body de creación correcto', () => {
    const parsed = createTechnicalControlBodySchema.parse(validBody)
    expect(parsed.controlType).toBe('weight')
    expect(parsed.status).toBe('passed')
    expect(parsed.carNumber).toBe(44)
  })

  it('permite omitir piloto, carrera y observaciones', () => {
    const minimal = {
      teamId: validUuid,
      carNumber: 44,
      controlType: 'fuel' as const,
      status: 'rejected' as const,
      inspectedAt: '2026-10-14T12:00:00.000Z',
      expiresAt: '2026-10-14T18:00:00.000Z',
    }
    const parsed = createTechnicalControlBodySchema.parse(minimal)
    expect(parsed.controlType).toBe('fuel')
    expect(parsed.status).toBe('rejected')
  })

  it('falla con tipo de control inválido', () => {
    expect(() =>
      createTechnicalControlBodySchema.parse({
        ...validBody,
        controlType: 'invalid_type',
      }),
    ).toThrow()
  })

  it('falla con status inválido', () => {
    expect(() =>
      createTechnicalControlBodySchema.parse({
        ...validBody,
        status: 'pending',
      }),
    ).toThrow()
  })

  it('falla ante campos desconocidos por strictObject', () => {
    expect(() =>
      createTechnicalControlBodySchema.parse({
        ...validBody,
        extra: 'not-allowed',
      }),
    ).toThrow()
  })

  it('valida el DTO completo con version y createdAt', () => {
    const dto = {
      id: validUuid,
      teamId: validUuid,
      teamName: 'Ferrari',
      driverId: validUuid,
      driverName: 'Charles Leclerc',
      carNumber: 16,
      raceId: null,
      raceName: null,
      controlType: 'dimensions' as const,
      status: 'passed' as const,
      notes: null,
      inspectedAt: '2026-10-14T12:00:00.000Z',
      expiresAt: '2026-10-14T18:00:00.000Z',
      version: 1,
      createdAt: '2026-10-14T12:00:00.000Z',
    }
    expect(technicalControlSchema.parse(dto).teamName).toBe('Ferrari')
  })

  it('valida y coerciona parámetros de query', () => {
    const query = technicalControlsQuerySchema.parse({
      season: '2026',
      controlType: 'engine',
      status: 'passed',
    })
    expect(query.season).toBe(2026)
    expect(query.controlType).toBe('engine')
  })
})
