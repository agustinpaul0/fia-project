import type { TeamStaffRepository } from '../features/team-staff/team-staff.port'
import type { StaffAccountsPort } from '../features/team-staff/team-staff-accounts.port'
import type {
  TeamStaffUnitOfWork,
  TeamStaffWorkScope,
} from '../features/team-staff/team-staff-unit-of-work.port'
import { createInMemoryTeamStaffRepository } from './in-memory-team-staff.repository'
import { createInMemoryStaffAccounts, type FakeAccount } from './in-memory-team-staff-accounts'

export const createInMemoryTeamStaffUnitOfWork = (params?: {
  readonly staffRepo?: TeamStaffRepository
  readonly accountsRepo?: StaffAccountsPort
  readonly initialAccounts?: readonly FakeAccount[]
}): TeamStaffUnitOfWork => {
  const accounts =
    params?.accountsRepo ?? createInMemoryStaffAccounts(params?.initialAccounts ?? [])
  const accountsMap =
    'accounts' in accounts ? (accounts.accounts as Map<string, FakeAccount>) : undefined
  const staff = params?.staffRepo ?? createInMemoryTeamStaffRepository([], accountsMap)

  return {
    staff,
    run: async <T>(work: (scope: TeamStaffWorkScope) => Promise<T>): Promise<T> =>
      work({ staff, accounts }),
  }
}
