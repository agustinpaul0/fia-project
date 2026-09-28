import type { RaceType } from '@fia/shared/domain'

export type NotificationRecord = {
  readonly id: string
  readonly raceId: string
  readonly raceName: string
  readonly raceType: RaceType
  readonly raceDate: Date
  readonly seasonYear: number
  readonly resultsRevision: number
  readonly latestRevision: number
  readonly teamId: string
  readonly teamName: string
  readonly teamPoints: number
  readonly confirmedAt: Date | null
  readonly confirmedByName: string | null
  readonly createdAt: Date
}

export type ConfirmNotificationInput = {
  readonly id: string
  readonly userId: string
  readonly at: Date
}

export type NotificationsRepository = {
  readonly syncPending: (teamId: string | null) => Promise<void>
  readonly listPendingForTeam: (teamId: string) => Promise<readonly NotificationRecord[]>
  readonly listLatest: () => Promise<readonly NotificationRecord[]>
  readonly findById: (id: string) => Promise<NotificationRecord | null>
  readonly confirm: (input: ConfirmNotificationInput) => Promise<boolean>
}
