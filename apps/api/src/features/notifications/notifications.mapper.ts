import type { ScoreNotification } from '@fia/shared/contracts'
import type { NotificationRecord } from './notifications.port'

export const toScoreNotification = ({
  latestRevision: _latest,
  ...record
}: NotificationRecord): ScoreNotification => ({
  ...record,
  raceDate: record.raceDate.toISOString(),
  status: record.confirmedAt === null ? 'pending' : 'confirmed',
  confirmedAt: record.confirmedAt?.toISOString() ?? null,
  createdAt: record.createdAt.toISOString(),
})
