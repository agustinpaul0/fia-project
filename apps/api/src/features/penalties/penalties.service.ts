import type { CreatePenaltyBody, PenaltiesQuery, Penalty } from '@fia/shared/contracts'
import { AppError, type Role } from '@fia/shared/domain'
import type { PenaltiesRepository } from './penalties.port'

export type PenaltiesViewer = {
  readonly role: Role
  readonly teamId: string | null
} | null

export type PenaltiesService = {
  readonly list: (filter: PenaltiesQuery, viewer?: PenaltiesViewer) => Promise<readonly Penalty[]>
  readonly create: (body: CreatePenaltyBody) => Promise<Penalty>
  readonly confirm: (
    id: string,
    user: { readonly id: string; readonly teamId: string | null },
  ) => Promise<Penalty>
}

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
      confirmedAt: penalty.confirmedAt ?? null,
      confirmedByUserId: penalty.confirmedByUserId ?? null,
      notificationStatus: penalty.confirmedAt ? 'confirmed' : 'pending',
    }
  }
  return {
    ...penalty,
    confirmedAt: null,
    confirmedByUserId: null,
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
  confirm: async (id, user) => {
    if (!user.teamId) {
      throw new AppError('TEAM_REQUIRED')
    }
    const existing = await repo.findById?.(id)
    if (!existing) {
      throw new AppError('PENALTY_NOT_FOUND')
    }
    if (existing.teamId !== user.teamId) {
      throw new AppError('FORBIDDEN')
    }
    if (existing.confirmedAt) {
      throw new AppError('NOTIFICATION_ALREADY_CONFIRMED')
    }
    const updated = await repo.confirm?.({ id, userId: user.id, confirmedAt: now() })
    if (!updated) {
      throw new AppError('NOTIFICATION_ALREADY_CONFIRMED')
    }
    return updated
  },
})
