import type { CreatePenaltyBody, PenaltiesQuery, Penalty } from '@fia/shared/contracts'
import { AppError, type Role } from '@fia/shared/domain'
import { createPenaltyConfirmations, type PenaltyConfirmations } from './penalties.confirmations'
import type { PenaltiesRepository } from './penalties.port'

export type PenaltiesViewer = {
  readonly role: Role
  readonly teamId: string | null
} | null

export type PenaltiesService = {
  readonly list: (filter: PenaltiesQuery, viewer?: PenaltiesViewer) => Promise<readonly Penalty[]>
  readonly create: (body: CreatePenaltyBody) => Promise<Penalty>
} & PenaltyConfirmations

export const PENALTY_RETENTION_YEARS = 5

const retentionStart = (now: Date): Date => {
  const start = new Date(now)
  start.setUTCFullYear(start.getUTCFullYear() - PENALTY_RETENTION_YEARS)
  return start
}

const canViewNotificationStatus = (penalty: Penalty, viewer: PenaltiesViewer): boolean => {
  if (viewer === null) {
    return false
  }
  if (viewer.role === 'fia_admin') {
    return true
  }
  return viewer.role === 'team_staff' && viewer.teamId === penalty.teamId
}

const sanitizeForViewer = (penalty: Penalty, viewer?: PenaltiesViewer): Penalty => {
  if (viewer === undefined) {
    return penalty
  }
  if (canViewNotificationStatus(penalty, viewer)) {
    return {
      ...penalty,
      confirmedAt: penalty.confirmedAt,
      confirmedByName: penalty.confirmedByName,
      notificationStatus: penalty.confirmedAt ? 'confirmed' : 'pending',
    }
  }
  return {
    ...penalty,
    confirmedAt: null,
    confirmedByName: null,
    notificationStatus: null,
  }
}

export const createPenaltiesService = (
  repo: PenaltiesRepository,
  now: () => Date = () => new Date(),
): PenaltiesService => ({
  list: async (filter, viewer) => {
    const items = await repo.list({ ...filter, issuedSince: retentionStart(now()) })
    return items.map((p) => sanitizeForViewer(p, viewer))
  },
  create: async (body) => {
    if (body.driverId !== null && body.driverId !== undefined) {
      const belongs = await repo.driverBelongsToTeam(body.driverId, body.teamId)
      if (!belongs) {
        throw new AppError('INVALID_PENALTY_TARGET')
      }
    }
    return repo.create(body)
  },
  ...createPenaltyConfirmations(repo, { now, since: () => retentionStart(now()) }),
})
