import type { ScoreNotification } from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import type { SessionUser } from '../../core/auth/session'
import { toScoreNotification } from './notifications.mapper'
import type { NotificationRecord, NotificationsRepository } from './notifications.port'

export type NotificationsService = {
  readonly listMine: (user: SessionUser) => Promise<readonly ScoreNotification[]>
  readonly confirm: (user: SessionUser, id: string) => Promise<ScoreNotification>
  readonly audit: () => Promise<readonly ScoreNotification[]>
}

export type NotificationsServiceDeps = {
  readonly repository: NotificationsRepository
  readonly clock: () => Date
}

const teamOf = (user: SessionUser): string => {
  if (user.teamId === null) {
    throw new AppError('TEAM_REQUIRED')
  }
  return user.teamId
}

const assertConfirmable = (record: NotificationRecord | null, teamId: string): void => {
  if (record === null || record.teamId !== teamId) {
    throw new AppError('NOTIFICATION_NOT_FOUND')
  }
  if (record.confirmedAt !== null) {
    throw new AppError('NOTIFICATION_ALREADY_CONFIRMED')
  }
  if (record.resultsRevision < record.latestRevision) {
    throw new AppError('NOTIFICATION_SUPERSEDED')
  }
}

export const createNotificationsService = ({
  repository,
  clock,
}: NotificationsServiceDeps): NotificationsService => ({
  listMine: async (user) => {
    const teamId = teamOf(user)
    await repository.syncPending(teamId)
    return (await repository.listPendingForTeam(teamId)).map(toScoreNotification)
  },
  confirm: async (user, id) => {
    const teamId = teamOf(user)
    assertConfirmable(await repository.findById(id), teamId)
    if (!(await repository.confirm({ id, userId: user.id, at: clock() }))) {
      throw new AppError('NOTIFICATION_ALREADY_CONFIRMED')
    }
    const confirmed = await repository.findById(id)
    if (confirmed === null) {
      throw new AppError('NOTIFICATION_NOT_FOUND')
    }
    return toScoreNotification(confirmed)
  },
  audit: async () => {
    await repository.syncPending(null)
    return (await repository.listLatest()).map(toScoreNotification)
  },
})
