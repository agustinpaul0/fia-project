import { scoreNotifications } from '@fia/shared/db'
import { and, eq, isNull } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import type { ConfirmNotificationInput } from './notifications.port'

export const createNotificationsWriter = (db: DbExecutor) => ({
  confirm: async ({ id, userId, at }: ConfirmNotificationInput): Promise<boolean> => {
    const [current] = await db
      .select({ version: scoreNotifications.version })
      .from(scoreNotifications)
      .where(eq(scoreNotifications.id, id))
    if (current === undefined) {
      return false
    }
    const updated = await db
      .update(scoreNotifications)
      .set({ confirmedAt: at, confirmedByUserId: userId, version: current.version + 1 })
      .where(
        and(
          eq(scoreNotifications.id, id),
          eq(scoreNotifications.version, current.version),
          isNull(scoreNotifications.confirmedAt),
        ),
      )
      .returning({ id: scoreNotifications.id })
    return updated.length > 0
  },
})
