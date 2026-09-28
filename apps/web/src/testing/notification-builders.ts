import type { ScoreNotification } from '@fia/shared/contracts'

export const NOTIFICATION_ID = '00000000-0000-4000-8000-000000000501'

export const aScoreNotification = (
  overrides: Partial<ScoreNotification> = {},
): ScoreNotification => ({
  id: NOTIFICATION_ID,
  raceId: '00000000-0000-4000-8000-000000000900',
  raceName: 'Gran Premio de Mónaco 2025',
  raceType: 'grand_prix',
  raceDate: '2025-05-25T13:00:00.000Z',
  seasonYear: 2025,
  resultsRevision: 1,
  teamId: '00000000-0000-4000-8000-0000000000a1',
  teamName: 'McLaren',
  teamPoints: 43,
  status: 'pending',
  confirmedAt: null,
  confirmedByName: null,
  createdAt: '2025-05-25T16:00:00.000Z',
  ...overrides,
})
