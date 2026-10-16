import type { CreateTeamDriverBody, Driver } from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import type { SessionUser } from '../../core/auth/session'
import { toDriverDto } from './team-drivers.mapper'
import type { TeamDriversRepository } from './team-drivers.port'

export type TeamDriversService = {
  readonly listMine: (user: SessionUser) => Promise<readonly Driver[]>
  readonly enroll: (user: SessionUser, body: CreateTeamDriverBody) => Promise<Driver>
}

const MAX_DRIVERS_PER_ROLE = 2

const teamOf = (user: SessionUser): string => {
  if (user.teamId === null) {
    throw new AppError('TEAM_REQUIRED')
  }
  return user.teamId
}

export const createTeamDriversService = (
  repository: TeamDriversRepository,
): TeamDriversService => ({
  listMine: async (user) => {
    const teamId = teamOf(user)
    const rows = await repository.listByTeam(teamId)
    return rows.map(toDriverDto)
  },
  enroll: async (user, body) => {
    const teamId = teamOf(user)
    if ((await repository.findByNumber(body.number)) !== null) {
      throw new AppError('CAR_NUMBER_ALREADY_TAKEN')
    }
    if ((await repository.findByCode(body.code)) !== null) {
      throw new AppError('DRIVER_CODE_ALREADY_TAKEN')
    }
    const currentCount = await repository.countByTeamAndRole(teamId, body.role)
    if (currentCount >= MAX_DRIVERS_PER_ROLE) {
      throw new AppError('DRIVER_LIMIT_EXCEEDED')
    }
    const created = await repository.create(teamId, body)
    return toDriverDto(created)
  },
})
