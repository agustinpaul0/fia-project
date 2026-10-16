import { describe, expect, it } from 'vitest'
import { createTechnicalControlBodySchema } from './technical-controls'

describe('technical-controls: datos obligatorios del control', () => {
  const validBody = {
    teamId: '11111111-1111-4111-8111-111111111111',
    carNumber: 44,
    controlType: 'weight' as const,
    status: 'passed' as const,
    inspectedAt: '2026-10-14T12:00:00.000Z',
    expiresAt: '2026-10-14T18:00:00.000Z',
  }

  it.each([
    ['carNumber', undefined, 'Ingresá el número de auto inspeccionado.'],
    ['carNumber', 100, 'El número de auto debe estar entre 1 y 99.'],
    ['inspectedAt', '', 'Ingresá la fecha y hora del control.'],
    ['expiresAt', '', 'Ingresá la fecha y hora de expiración.'],
    ['expiresAt', '2026-10-14T12:00:00.000Z', 'La expiración debe ser posterior al control.'],
  ])('exige %s válido (%s)', (field, value, message) => {
    const result = createTechnicalControlBodySchema.safeParse({ ...validBody, [field]: value })
    expect(result.error?.issues[0]?.message).toBe(message)
  })
})
