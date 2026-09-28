import type { TeamStaffRepository } from './team-staff.port'
import type { StaffAccountsPort } from './team-staff-accounts.port'

export type TeamStaffWorkScope = {
  readonly staff: TeamStaffRepository
  readonly accounts: StaffAccountsPort
}

export type TeamStaffUnitOfWork = {
  readonly run: <T>(work: (scope: TeamStaffWorkScope) => Promise<T>) => Promise<T>
  readonly staff: TeamStaffRepository
}
