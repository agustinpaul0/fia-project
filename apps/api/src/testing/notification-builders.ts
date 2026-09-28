import type { SessionUser } from '../core/auth/session'
import type { NotificationRecord } from '../features/notifications/notifications.port'

export const TEAM_A = '00000000-0000-4000-8000-0000000000a1'
export const TEAM_B = '00000000-0000-4000-8000-0000000000b1'

export const STAFF_A: SessionUser = { id: 'staff-a', role: 'team_staff', teamId: TEAM_A }
export const STAFF_A2: SessionUser = { id: 'staff-a2', role: 'team_staff', teamId: TEAM_A }
export const STAFF_B: SessionUser = { id: 'staff-b', role: 'team_staff', teamId: TEAM_B }
export const STAFF_WITHOUT_TEAM: SessionUser = { id: 'staff-x', role: 'team_staff', teamId: null }

export const aNotification = (overrides: Partial<NotificationRecord> = {}): NotificationRecord => ({
  id: '00000000-0000-4000-8000-000000000501',
  raceId: '00000000-0000-4000-8000-000000000900',
  raceName: 'Gran Premio de Mónaco 2025',
  raceType: 'grand_prix',
  raceDate: new Date('2025-05-25T13:00:00.000Z'),
  seasonYear: 2025,
  resultsRevision: 1,
  latestRevision: 1,
  teamId: TEAM_A,
  teamName: 'McLaren',
  teamPoints: 43,
  confirmedAt: null,
  confirmedByName: null,
  createdAt: new Date('2025-05-25T16:00:00.000Z'),
  ...overrides,
})
