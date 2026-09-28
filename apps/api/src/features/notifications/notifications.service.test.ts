import { beforeEach, describe, expect, it } from 'vitest'
import {
  createInMemoryNotifications,
  type InMemoryNotifications,
} from '../../testing/in-memory-notifications.repository'
import {
  aNotification,
  STAFF_A,
  STAFF_A2,
  STAFF_B,
  STAFF_WITHOUT_TEAM,
  TEAM_A,
} from '../../testing/notification-builders'
import { createNotificationsService, type NotificationsService } from './notifications.service'

const NOW = new Date('2026-09-28T12:00:00.000Z')
const PENDING = aNotification()
const OLD = aNotification({ id: '00000000-0000-4000-8000-000000000502', latestRevision: 2 })
const NAMES = { 'staff-a': 'Ana Pérez', 'staff-a2': 'Beto Gómez' }

describe('NotificationsService', () => {
  let repository: InMemoryNotifications
  let service: NotificationsService

  beforeEach(() => {
    repository = createInMemoryNotifications([PENDING, OLD], NAMES)
    service = createNotificationsService({ repository, clock: () => NOW })
  })

  it('sincroniza y lista sólo las pendientes vigentes de la escudería del usuario', async () => {
    const mine = await service.listMine(STAFF_A)
    expect(mine.map((n) => n.id)).toEqual([PENDING.id])
    expect(mine[0]).toMatchObject({ status: 'pending', teamPoints: 43, confirmedAt: null })
    expect(repository.syncedTeams).toEqual([TEAM_A])
    expect(await service.listMine(STAFF_B)).toEqual([])
  })

  it('confirma registrando quién y cuándo, y la notificación deja de estar pendiente', async () => {
    const confirmed = await service.confirm(STAFF_A, PENDING.id)
    expect(confirmed).toMatchObject({
      status: 'confirmed',
      confirmedAt: NOW.toISOString(),
      confirmedByName: 'Ana Pérez',
    })
    expect(await service.listMine(STAFF_A)).toEqual([])
  })

  it('avisa que ya no hace falta si otra persona de la escudería ya confirmó', async () => {
    await service.confirm(STAFF_A, PENDING.id)
    await expect(service.confirm(STAFF_A2, PENDING.id)).rejects.toMatchObject({
      code: 'NOTIFICATION_ALREADY_CONFIRMED',
    })
  })

  it.each([
    { caso: 'es de otra escudería', user: STAFF_B, id: PENDING.id, code: 'NOTIFICATION_NOT_FOUND' },
    {
      caso: 'no existe',
      user: STAFF_A,
      id: '00000000-0000-4000-8000-000000000599',
      code: 'NOTIFICATION_NOT_FOUND',
    },
    { caso: 'el puntaje se corrigió', user: STAFF_A, id: OLD.id, code: 'NOTIFICATION_SUPERSEDED' },
    { caso: 'no tiene escudería', user: STAFF_WITHOUT_TEAM, id: PENDING.id, code: 'TEAM_REQUIRED' },
  ])('no permite confirmar si $caso', async ({ user, id, code }) => {
    await expect(service.confirm(user, id)).rejects.toMatchObject({ code })
  })

  it('rechaza listar a quien no tiene escudería', async () => {
    await expect(service.listMine(STAFF_WITHOUT_TEAM)).rejects.toMatchObject({
      code: 'TEAM_REQUIRED',
    })
  })

  it('si la confirmación pierde la carrera contra otra, informa que ya estaba confirmada', async () => {
    const racing = { ...repository, confirm: async () => false }
    const raced = createNotificationsService({ repository: racing, clock: () => NOW })
    await expect(raced.confirm(STAFF_A, PENDING.id)).rejects.toMatchObject({
      code: 'NOTIFICATION_ALREADY_CONFIRMED',
    })
  })

  it('la auditoría de la FIA sincroniza todo y muestra las revisiones vigentes', async () => {
    await service.confirm(STAFF_A, PENDING.id)
    const audit = await service.audit()
    expect(audit.map((n) => [n.id, n.status, n.confirmedByName])).toEqual([
      [PENDING.id, 'confirmed', 'Ana Pérez'],
    ])
    expect(repository.syncedTeams).toContain(null)
  })
})
