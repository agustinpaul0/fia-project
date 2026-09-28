import { describe, expect, it } from 'vitest'
import { confirmNotificationPath, NOTIFICATIONS_AUDIT_PATH } from './api-paths'
import { scoreNotificationSchema } from './notifications'

const VALID = {
  id: '00000000-0000-4000-8000-000000000501',
  raceId: '00000000-0000-4000-8000-000000000900',
  raceName: 'Gran Premio de Mónaco 2025',
  raceType: 'grand_prix',
  raceDate: '2025-05-25T13:00:00.000Z',
  seasonYear: 2025,
  resultsRevision: 1,
  teamId: '00000000-0000-4000-8000-0000000000a1',
  teamName: 'McLaren',
  teamPoints: 43,
  status: 'confirmed',
  confirmedAt: '2025-05-26T13:30:00.000Z',
  confirmedByName: 'Ana Pérez',
  createdAt: '2025-05-25T16:00:00.000Z',
}

describe('contrato de notificaciones de puntaje', () => {
  it('acepta una notificación confirmada o pendiente', () => {
    expect(scoreNotificationSchema.parse(VALID)).toEqual(VALID)
    const pending = { ...VALID, status: 'pending', confirmedAt: null, confirmedByName: null }
    expect(scoreNotificationSchema.parse(pending).status).toBe('pending')
  })

  it.each([
    { ...VALID, status: 'leida' },
    { ...VALID, resultsRevision: 0 },
    { ...VALID, teamPoints: -1 },
    { ...VALID, userId: 'filtrado' },
  ])('rechaza datos que no cumplen el contrato %#', (candidate) => {
    expect(scoreNotificationSchema.safeParse(candidate).success).toBe(false)
  })

  it('arma las rutas de confirmación y auditoría', () => {
    expect(confirmNotificationPath('abc')).toBe('/notifications/abc/confirm')
    expect(NOTIFICATIONS_AUDIT_PATH).toBe('/notifications/audit')
  })
})
