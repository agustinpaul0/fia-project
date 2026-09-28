import { AppError } from '@fia/shared/domain'
import type { TeamStaffUnitOfWork } from '../team-staff-unit-of-work.port'

export type DeactivateStaffParams = {
  readonly uow: TeamStaffUnitOfWork
  readonly id: string
  readonly version: number
  readonly deactivatedBy: string
}

export const executeDeactivateTeamStaff = async ({
  uow,
  id,
  version,
  deactivatedBy,
}: DeactivateStaffParams): Promise<void> => {
  const current = await uow.staff.findById(id)
  if (!current) {
    throw new AppError('STAFF_MEMBER_NOT_FOUND')
  }

  if (!current.isActive) {
    if (current.version === version) {
      return
    }
    throw new AppError('STALE_VERSION')
  }

  return uow.run(async ({ staff, accounts }) => {
    const deactivated = await staff.deactivate(id, {
      version,
      deactivatedBy,
      deactivatedAt: new Date(),
    })

    if (!deactivated) {
      throw new AppError('STALE_VERSION')
    }

    await accounts.banAccount(current.userId)
  })
}
