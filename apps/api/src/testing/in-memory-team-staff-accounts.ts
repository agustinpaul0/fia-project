import { AppError } from '@fia/shared/domain'
import type {
  CreateAccountInput,
  StaffAccountsPort,
  UpdateAccountInput,
} from '../features/team-staff/team-staff-accounts.port'

export type FakeAccount = {
  id: string
  email: string
  name: string
  role: string
  teamId: string
  banned: boolean
}

export const createInMemoryStaffAccounts = (
  initialAccounts: readonly FakeAccount[] = [],
): StaffAccountsPort & { readonly accounts: Map<string, FakeAccount> } => {
  const accounts = new Map<string, FakeAccount>(initialAccounts.map((a) => [a.id, { ...a }]))

  return {
    accounts,
    createAccount: async (input: CreateAccountInput) => {
      const existing = [...accounts.values()].find(
        (a) => a.email.toLowerCase() === input.email.toLowerCase(),
      )
      if (existing) {
        throw new AppError('USER_ALREADY_EXISTS')
      }
      const userId = `user-${accounts.size + 1}`
      accounts.set(userId, {
        id: userId,
        email: input.email,
        name: input.name,
        role: input.role,
        teamId: input.teamId,
        banned: false,
      })
      return { userId }
    },
    updateAccount: async (userId: string, input: UpdateAccountInput) => {
      const existing = accounts.get(userId)
      if (!existing) {
        return
      }
      accounts.set(userId, { ...existing, ...input })
    },
    banAccount: async (userId: string) => {
      const existing = accounts.get(userId)
      if (!existing) {
        return
      }
      accounts.set(userId, { ...existing, banned: true })
    },
  }
}
