import type { TransactionalDatabase } from '../../core/db/client'
import type { NotificationsRepository } from './notifications.port'
import { createNotificationsReader } from './notifications.read.repository'
import { createNotificationsSync } from './notifications.sync.repository'
import { createNotificationsWriter } from './notifications.write.repository'

export const createDrizzleNotificationsRepository = (
  db: TransactionalDatabase,
): NotificationsRepository => ({
  ...createNotificationsSync(db),
  ...createNotificationsReader(db),
  ...createNotificationsWriter(db),
})
