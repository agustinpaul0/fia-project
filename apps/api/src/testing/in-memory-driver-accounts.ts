import type {
  CreateDriverAccountBody,
  DriverAccount,
  UpdateDriverAccountBody,
} from '@fia/shared/contracts'

const buildDriverAccount = (seq: number, body: CreateDriverAccountBody): DriverAccount => {
  const now = new Date().toISOString()
  return {
    id: `00000000-0000-4000-9000-${String(seq).padStart(12, '0')}`,
    driverId: body.driverId,
    name: body.name,
    email: body.email,
    role: 'driver',
    isOfficial: true,
    isActive: true,
    version: 1,
    createdAt: now,
    updatedAt: now,
  }
}

export const createInMemoryDriverAccountsStore = () => {
  const accounts: DriverAccount[] = []

  return {
    listAccounts: async (): Promise<readonly DriverAccount[]> => [...accounts],
    createAccount: async (body: CreateDriverAccountBody): Promise<DriverAccount> => {
      const created = buildDriverAccount(accounts.length + 1, body)
      accounts.push(created)
      return created
    },
    updateAccount: async (
      id: string,
      body: UpdateDriverAccountBody,
    ): Promise<DriverAccount | null> => {
      const idx = accounts.findIndex((a) => a.id === id && a.version === body.version)
      const current = accounts[idx]
      if (idx === -1 || !current) {
        return null
      }
      const updated: DriverAccount = {
        ...current,
        name: body.name,
        version: body.version + 1,
        updatedAt: new Date().toISOString(),
      }
      accounts[idx] = updated
      return updated
    },
    deactivateAccount: async (id: string): Promise<DriverAccount | null> => {
      const idx = accounts.findIndex((a) => a.id === id)
      const current = accounts[idx]
      if (idx === -1 || !current) {
        return null
      }
      const deactivated: DriverAccount = {
        ...current,
        isActive: false,
        version: current.version + 1,
        updatedAt: new Date().toISOString(),
      }
      accounts[idx] = deactivated
      return deactivated
    },
  }
}
