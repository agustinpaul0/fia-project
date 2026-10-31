import type { Penalty } from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import type { PenaltiesRepository } from './penalties.port'

export type PenaltyConfirmer = { readonly id: string; readonly teamId: string | null }

export type PenaltyConfirmations = {
  readonly confirm: (id: string, user: PenaltyConfirmer) => Promise<Penalty>
  readonly pending: (user: PenaltyConfirmer) => Promise<readonly Penalty[]>
}

const teamOf = (user: PenaltyConfirmer): string => {
  if (!user.teamId) {
    throw new AppError('TEAM_REQUIRED')
  }
  return user.teamId
}

const confirmable = async (repo: PenaltiesRepository, id: string, teamId: string) => {
  const existing = await repo.findById(id)
  if (!existing) {
    throw new AppError('PENALTY_NOT_FOUND')
  }
  if (existing.teamId !== teamId) {
    throw new AppError('FORBIDDEN')
  }
  if (existing.confirmedAt) {
    throw new AppError('NOTIFICATION_ALREADY_CONFIRMED')
  }
  return existing
}

export const createPenaltyConfirmations = (
  repo: PenaltiesRepository,
  clock: { readonly now: () => Date; readonly since: () => Date },
): PenaltyConfirmations => ({
  confirm: async (id, user) => {
    const existing = await confirmable(repo, id, teamOf(user))
    const updated = await repo.confirm({
      id,
      userId: user.id,
      confirmedAt: clock.now(),
      version: existing.version,
    })
    if (!updated) {
      throw new AppError('NOTIFICATION_ALREADY_CONFIRMED')
    }
    return updated
  },
  pending: async (user) => {
    const items = await repo.list({ teamId: teamOf(user), issuedSince: clock.since() })
    return items.filter((p) => p.confirmedAt === null)
  },
})
