import type { DriverAccount } from '@fia/shared/contracts'
import type { DriverRow } from '@fia/shared/db'
import type {
  DriverAccountsRepository,
  DriverAccountsUnitOfWork,
} from '../features/driver-accounts/driver-accounts.port'
import { createInMemoryStaffAccounts, type FakeAccount } from './in-memory-team-staff-accounts'

type StoredAccount = Omit<DriverAccount, 'name' | 'email' | 'driverName' | 'driverCode'>

const accountId = (seq: number): string =>
  `00000000-0000-4000-9000-${String(seq).padStart(12, '0')}`

const newStoredAccount = (seq: number, userId: string, driverId: string): StoredAccount => {
  const now = new Date().toISOString()
  return {
    id: accountId(seq),
    userId,
    driverId,
    teamName: null,
    role: 'driver',
    isOfficial: true,
    isActive: true,
    deactivatedAt: null,
    version: 1,
    createdAt: now,
    updatedAt: now,
  }
}

const dtoFactory =
  (drivers: readonly DriverRow[], users: Map<string, FakeAccount>) =>
  (row: StoredAccount): DriverAccount => {
    const driver = drivers.find((d) => d.id === row.driverId)
    const account = users.get(row.userId)
    return {
      ...row,
      name: account?.name ?? '',
      email: account?.email ?? '',
      driverName: driver ? `${driver.firstName} ${driver.lastName}` : '',
      driverCode: driver?.code ?? '',
    }
  }

const createRepository = (
  drivers: readonly DriverRow[],
  users: Map<string, FakeAccount>,
): DriverAccountsRepository => {
  const rows: StoredAccount[] = []
  const toDto = dtoFactory(drivers, users)
  const replace = (id: string, version: number, patch: Partial<StoredAccount>) => {
    const index = rows.findIndex((r) => r.id === id && r.version === version)
    const current = rows[index]
    if (!current) {
      return null
    }
    const next = { ...current, ...patch, version: version + 1, updatedAt: new Date().toISOString() }
    rows[index] = next
    return toDto(next)
  }
  const maybeDto = (row: StoredAccount | undefined) => (row ? toDto(row) : null)
  return {
    list: async () => rows.map(toDto),
    findById: async (id) => maybeDto(rows.find((r) => r.id === id)),
    findByDriverId: async (driverId) => maybeDto(rows.find((r) => r.driverId === driverId)),
    findDriver: async (driverId) => {
      const driver = drivers.find((d) => d.id === driverId)
      return driver ? { id: driver.id, teamId: driver.teamId } : null
    },
    create: async ({ userId, driverId }) => {
      const row = newStoredAccount(rows.length + 1, userId, driverId)
      rows.push(row)
      return toDto(row)
    },
    bumpVersion: async (id, version) => replace(id, version, {}),
    deactivate: async (id, input) =>
      replace(id, input.version, {
        isActive: false,
        deactivatedAt: input.deactivatedAt.toISOString(),
      }),
  }
}

export const createInMemoryDriverAccountsUow = (
  drivers: readonly DriverRow[],
): DriverAccountsUnitOfWork & { readonly users: Map<string, FakeAccount> } => {
  const users = createInMemoryStaffAccounts()
  const accounts = createRepository(drivers, users.accounts)
  return { accounts, users: users.accounts, run: (work) => work({ accounts, users }) }
}
