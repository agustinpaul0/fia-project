import { createBetterAuth } from '../../core/auth/better-auth'
import type { Database } from '../../core/db/client'
import { createDrizzleStaffAccountsAdapter } from '../team-staff/team-staff-accounts.adapter'
import type { DrizzleTeamStaffUowConfig } from '../team-staff/team-staff-unit-of-work'
import type { DriverAccountsUnitOfWork, DriverAccountsWorkScope } from './driver-accounts.port'
import { createDrizzleDriverAccountsRepository } from './driver-accounts.repository'

export const createDrizzleDriverAccountsUnitOfWork = (
  db: Database,
  authConfig: DrizzleTeamStaffUowConfig,
): DriverAccountsUnitOfWork => ({
  accounts: createDrizzleDriverAccountsRepository(db),
  run: async <T>(work: (scope: DriverAccountsWorkScope) => Promise<T>): Promise<T> =>
    db.transaction(async (tx) =>
      work({
        accounts: createDrizzleDriverAccountsRepository(tx),
        users: createDrizzleStaffAccountsAdapter(createBetterAuth({ db: tx, ...authConfig })),
      }),
    ),
})
