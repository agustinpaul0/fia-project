import { z } from 'zod'
import { raceTypeSchema } from './race-classification'

export const NOTIFICATION_STATUSES = ['pending', 'confirmed'] as const

export const scoreNotificationSchema = z.strictObject({
  id: z.uuid(),
  raceId: z.uuid(),
  raceName: z.string(),
  raceType: raceTypeSchema,
  raceDate: z.iso.datetime(),
  seasonYear: z.int(),
  resultsRevision: z.int().positive(),
  teamId: z.uuid(),
  teamName: z.string(),
  teamPoints: z.int().nonnegative(),
  status: z.enum(NOTIFICATION_STATUSES),
  confirmedAt: z.iso.datetime().nullable(),
  confirmedByName: z.string().nullable(),
  createdAt: z.iso.datetime(),
})

export const scoreNotificationListSchema = z.array(scoreNotificationSchema).readonly()

export type ScoreNotification = z.infer<typeof scoreNotificationSchema>
export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number]
