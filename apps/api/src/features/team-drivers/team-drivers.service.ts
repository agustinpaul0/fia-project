import type { CreateTeamDriverBody, Driver, UpdateTeamDriverBody } from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import type { SessionUser } from '../../core/auth/session'
import { createDriverAccountsService, type DriverAccountsService } from './driver-accounts.service'
import { toDriverDto } from './team-drivers.mapper'
import type { TeamDriversRepository } from './team-drivers.port'

export type UpdateTeamDriverCommand = {
  readonly user: SessionUser
  readonly id: string
  readonly body: UpdateTeamDriverBody
}

export type TeamDriversService = DriverAccountsService & {
  readonly listPublic: () => Promise<readonly Driver[]>
  readonly listMine: (user: SessionUser) => Promise<readonly Driver[]>
  readonly enroll: (user: SessionUser, body: CreateTeamDriverBody) => Promise<Driver>
  readonly update: (command: UpdateTeamDriverCommand) => Promise<Driver>
}

const MAX_DRIVERS_PER_ROLE = 2

const teamOf = (user: SessionUser): string => {
  if (user.teamId === null) {
    throw new AppError('TEAM_REQUIRED')
  }
  return user.teamId
}

const executeDriverUpdate = async (
  repository: TeamDriversRepository,
  { user, id, body }: UpdateTeamDriverCommand,
): Promise<Driver> => {
  const teamId = teamOf(user)
  const current = await repository.findById(id)
  if (current === null) {
    throw new AppError('DRIVER_NOT_FOUND')
  }
  if (current.teamId !== teamId) {
    throw new AppError('FORBIDDEN')
  }
  if (body.number !== current.number && (await repository.findByNumber(teamId, body.number))) {
    throw new AppError('CAR_NUMBER_ALREADY_TAKEN')
  }
  if (body.code !== current.code && (await repository.findByCode(body.code))) {
    throw new AppError('DRIVER_CODE_ALREADY_TAKEN')
  }
  if (
    body.role !== current.role &&
    (await repository.countByTeamAndRole(teamId, body.role)) >= MAX_DRIVERS_PER_ROLE
  ) {
    throw new AppError('DRIVER_LIMIT_EXCEEDED')
  }
  const updated = await repository.update(id, body)
  if (updated === null) {
    throw new AppError('STALE_VERSION')
  }
  return toDriverDto(updated)
}

export const createTeamDriversService = (
  repository: TeamDriversRepository,
): TeamDriversService => ({
  ...createDriverAccountsService(repository),
  listPublic: async () => (await repository.listAll()).map(toDriverDto),
  listMine: async (user) => (await repository.listByTeam(teamOf(user))).map(toDriverDto),
  enroll: async (user, body) => {
    const teamId = teamOf(user)
    if ((await repository.findByNumber(teamId, body.number)) !== null) {
      throw new AppError('CAR_NUMBER_ALREADY_TAKEN')
    }
    if ((await repository.findByCode(body.code)) !== null) {
      throw new AppError('DRIVER_CODE_ALREADY_TAKEN')
    }
    if ((await repository.countByTeamAndRole(teamId, body.role)) >= MAX_DRIVERS_PER_ROLE) {
      throw new AppError('DRIVER_LIMIT_EXCEEDED')
    }
    return toDriverDto(await repository.create(teamId, body))
  },
  update: (cmd) => executeDriverUpdate(repository, cmd),
})
