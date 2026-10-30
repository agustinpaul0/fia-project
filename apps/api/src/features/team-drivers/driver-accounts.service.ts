import type {
  CreateDriverAccountBody,
  DriverAccount,
  UpdateDriverAccountBody,
} from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import type { TeamDriversRepository } from './team-drivers.port'

export type DriverAccountsService = {
  readonly listAccounts: () => Promise<readonly DriverAccount[]>
  readonly createAccount: (body: CreateDriverAccountBody) => Promise<DriverAccount>
  readonly updateAccount: (id: string, body: UpdateDriverAccountBody) => Promise<DriverAccount>
  readonly deactivateAccount: (id: string) => Promise<DriverAccount>
}

export const createDriverAccountsService = (
  repository: TeamDriversRepository,
): DriverAccountsService => ({
  listAccounts: async () => (await repository.listAccounts?.()) ?? [],
  createAccount: async (body) => {
    const driver = await repository.findById(body.driverId)
    if (!driver) {
      throw new AppError('DRIVER_NOT_FOUND')
    }
    const accounts = (await repository.listAccounts?.()) ?? []
    if (accounts.some((a) => a.driverId === body.driverId)) {
      throw new AppError('DRIVER_ACCOUNT_ALREADY_EXISTS')
    }
    if (accounts.some((a) => a.email === body.email)) {
      throw new AppError('DRIVER_EMAIL_ALREADY_EXISTS')
    }
    const created = await repository.createAccount?.(body)
    if (!created) {
      throw new AppError('INTERNAL_ERROR')
    }
    return created
  },
  updateAccount: async (id, body) => {
    const accounts = (await repository.listAccounts?.()) ?? []
    if (!accounts.some((a) => a.id === id)) {
      throw new AppError('DRIVER_ACCOUNT_NOT_FOUND')
    }
    const updated = await repository.updateAccount?.(id, body)
    if (!updated) {
      throw new AppError('STALE_VERSION')
    }
    return updated
  },
  deactivateAccount: async (id) => {
    const deactivated = await repository.deactivateAccount?.(id)
    if (!deactivated) {
      throw new AppError('DRIVER_ACCOUNT_NOT_FOUND')
    }
    return deactivated
  },
})
