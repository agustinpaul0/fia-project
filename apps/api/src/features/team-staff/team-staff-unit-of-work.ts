import { createBetterAuth } from '../../core/auth/better-auth'
import type { Database } from '../../core/db/client'
import { createDrizzleTeamStaffRepository } from './team-staff.repository'
import { createDrizzleStaffAccountsAdapter } from './team-staff-accounts.adapter'
import type { TeamStaffUnitOfWork, TeamStaffWorkScope } from './team-staff-unit-of-work.port'

export type DrizzleTeamStaffUowConfig = {
  readonly secret: string
  readonly baseURL: string
  readonly trustedOrigins: readonly string[]
}

export const createDrizzleTeamStaffUnitOfWork = (
  db: Database,
  authConfig: DrizzleTeamStaffUowConfig,
): TeamStaffUnitOfWork => {
  const staff = createDrizzleTeamStaffRepository(db)

  return {
    staff,
    run: async <T>(work: (scope: TeamStaffWorkScope) => Promise<T>): Promise<T> =>
      db.transaction(async (tx) => {
        const txStaff = createDrizzleTeamStaffRepository(tx)
        const txAuth = createBetterAuth({
          db: tx as unknown as Database,
          secret: authConfig.secret,
          baseURL: authConfig.baseURL,
          trustedOrigins: authConfig.trustedOrigins,
        })
        const txAccounts = createDrizzleStaffAccountsAdapter(txAuth)
        return work({ staff: txStaff, accounts: txAccounts })
      }),
  }
}
