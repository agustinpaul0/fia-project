import { AppError } from '@fia/shared/domain'
import type { BetterAuthInstance } from '../../core/auth/better-auth'
import type {
  CreateAccountInput,
  StaffAccountsPort,
  UpdateAccountInput,
} from './team-staff-accounts.port'

type InternalAdapter = {
  readonly updateUser: (id: string, data: Record<string, unknown>) => Promise<unknown>
  readonly deleteUserSessions: (id: string) => Promise<unknown>
}

type AuthWithContext = {
  readonly $context: Promise<{ readonly internalAdapter: InternalAdapter }>
}

export const createDrizzleStaffAccountsAdapter = (auth: BetterAuthInstance): StaffAccountsPort => {
  const getInternalAdapter = async (): Promise<InternalAdapter> => {
    const ctx = await (auth as unknown as AuthWithContext)['$context']
    return ctx.internalAdapter
  }

  return {
    createAccount: async (input: CreateAccountInput) => {
      try {
        const res = await auth.api.createUser({
          body: {
            email: input.email,
            password: input.password,
            name: input.name,
            role: input.role,
            data: { teamId: input.teamId },
          },
        })
        return { userId: res.user.id }
      } catch (err: unknown) {
        if (
          err &&
          typeof err === 'object' &&
          'body' in err &&
          err.body &&
          typeof err.body === 'object' &&
          'code' in err.body &&
          typeof err.body.code === 'string' &&
          err.body.code.includes('USER_ALREADY_EXISTS')
        ) {
          throw new AppError('USER_ALREADY_EXISTS')
        }
        throw err
      }
    },
    updateAccount: async (userId: string, input: UpdateAccountInput) => {
      const adapter = await getInternalAdapter()
      await adapter.updateUser(userId, {
        name: input.name,
        teamId: input.teamId,
      })
    },
    banAccount: async (userId: string) => {
      const adapter = await getInternalAdapter()
      await adapter.updateUser(userId, {
        banned: true,
        banReason: 'Baja lógica de personal de escudería',
        banExpires: null,
        updatedAt: new Date(),
      })
      await adapter.deleteUserSessions(userId)
    },
  }
}
