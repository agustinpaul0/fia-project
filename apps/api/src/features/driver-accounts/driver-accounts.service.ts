import type {
  CreateDriverAccountBody,
  DriverAccount,
  UpdateDriverAccountBody,
} from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import type { DriverAccountsUnitOfWork } from './driver-accounts.port'

export type DeactivateDriverAccountCommand = {
  readonly id: string
  readonly version: number
  readonly deactivatedBy: string
}

export type DriverAccountsService = {
  readonly list: () => Promise<readonly DriverAccount[]>
  readonly mine: (userId: string) => Promise<DriverAccount>
  readonly create: (body: CreateDriverAccountBody) => Promise<DriverAccount>
  readonly update: (id: string, body: UpdateDriverAccountBody) => Promise<DriverAccount>
  readonly deactivate: (command: DeactivateDriverAccountCommand) => Promise<DriverAccount>
}

const existingOrFail = async (uow: DriverAccountsUnitOfWork, id: string) => {
  const current = await uow.accounts.findById(id)
  if (!current) {
    throw new AppError('DRIVER_ACCOUNT_NOT_FOUND')
  }
  return current
}

const orStale = (account: DriverAccount | null): DriverAccount => {
  if (!account) {
    throw new AppError('STALE_VERSION')
  }
  return account
}

const create = async (uow: DriverAccountsUnitOfWork, body: CreateDriverAccountBody) => {
  if (!(await uow.accounts.findDriver(body.driverId))) {
    throw new AppError('DRIVER_NOT_FOUND')
  }
  if (await uow.accounts.findByDriverId(body.driverId)) {
    throw new AppError('DRIVER_ACCOUNT_ALREADY_EXISTS')
  }
  return uow.run(async ({ accounts, users }) => {
    const { email, password, name, driverId } = body
    const { userId } = await users.createAccount({
      email,
      password,
      name,
      role: 'driver',
      teamId: null,
    })
    return accounts.create({ userId, driverId })
  })
}

const update = async (uow: DriverAccountsUnitOfWork, id: string, body: UpdateDriverAccountBody) => {
  const current = await existingOrFail(uow, id)
  if (!current.isActive) {
    throw new AppError('DRIVER_ACCOUNT_INACTIVE')
  }
  return uow.run(async ({ accounts, users }) => {
    orStale(await accounts.bumpVersion(id, body.version))
    await users.updateAccount(current.userId, { name: body.name, teamId: null })
    return orStale(await accounts.findById(id))
  })
}

const deactivate = async (
  uow: DriverAccountsUnitOfWork,
  { id, version, deactivatedBy }: DeactivateDriverAccountCommand,
) => {
  const current = await existingOrFail(uow, id)
  if (!current.isActive && current.version === version) {
    return current
  }
  return uow.run(async ({ accounts, users }) => {
    const input = { version, deactivatedBy, deactivatedAt: new Date() }
    const deactivated = orStale(await accounts.deactivate(id, input))
    await users.banAccount(current.userId)
    return deactivated
  })
}

export const createDriverAccountsService = (
  uow: DriverAccountsUnitOfWork,
): DriverAccountsService => ({
  list: () => uow.accounts.list(),
  mine: async (userId) => {
    const account = await uow.accounts.findByUserId(userId)
    if (!account?.isActive) {
      throw new AppError('DRIVER_ACCOUNT_NOT_FOUND')
    }
    return account
  },
  create: (body) => create(uow, body),
  update: (id, body) => update(uow, id, body),
  deactivate: (command) => deactivate(uow, command),
})
