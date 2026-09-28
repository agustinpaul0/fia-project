import {
  API_PATHS,
  confirmNotificationPath,
  NOTIFICATIONS_AUDIT_PATH,
  type ScoreNotification,
  scoreNotificationListSchema,
  scoreNotificationSchema,
} from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const
export const NOTIFICATIONS_AUDIT_QUERY_KEY = [...NOTIFICATIONS_QUERY_KEY, 'audit'] as const
export const NOTIFICATIONS_REFRESH_MS = 30_000

export const fetchMyNotifications = (): Promise<readonly ScoreNotification[]> =>
  apiRequest({ path: API_PATHS.notifications, schema: scoreNotificationListSchema })

export const fetchNotificationsAudit = (): Promise<readonly ScoreNotification[]> =>
  apiRequest({ path: NOTIFICATIONS_AUDIT_PATH, schema: scoreNotificationListSchema })

export const confirmNotification = (id: string): Promise<ScoreNotification> =>
  apiRequest({ path: confirmNotificationPath(id), method: 'POST', schema: scoreNotificationSchema })
