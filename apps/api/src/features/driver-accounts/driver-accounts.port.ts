import type { DriverAccount } from '@fia/shared/contracts'
import type { StaffAccountsPort } from '../team-staff/team-staff-accounts.port'

export type DriverAccountTarget = {
  readonly id: string
  readonly teamId: string | null
}

export type DeactivateDriverAccountRecord = {
  readonly version: number
  readonly deactivatedBy: string
  readonly deactivatedAt: Date
}

export type DriverAccountsRepository = {
  readonly list: () => Promise<readonly DriverAccount[]>
  readonly findById: (id: string) => Promise<DriverAccount | null>
  readonly findByDriverId: (driverId: string) => Promise<DriverAccount | null>
  readonly findDriver: (driverId: string) => Promise<DriverAccountTarget | null>
  readonly create: (input: { userId: string; driverId: string }) => Promise<DriverAccount>
  readonly bumpVersion: (id: string, version: number) => Promise<DriverAccount | null>
  readonly deactivate: (
    id: string,
    input: DeactivateDriverAccountRecord,
  ) => Promise<DriverAccount | null>
}

export type DriverAccountsWorkScope = {
  readonly accounts: DriverAccountsRepository
  readonly users: StaffAccountsPort
}

export type DriverAccountsUnitOfWork = {
  readonly accounts: DriverAccountsRepository
  readonly run: <T>(work: (scope: DriverAccountsWorkScope) => Promise<T>) => Promise<T>
}
