import type { TeamStaff } from '@fia/shared/contracts'
import type { TeamStaffRow } from '@fia/shared/db'

export type JoinedTeamStaffRow = {
  readonly staff: TeamStaffRow
  readonly userEmail: string
  readonly teamName: string
}

export const toTeamStaffDto = ({ staff, userEmail, teamName }: JoinedTeamStaffRow): TeamStaff => ({
  id: staff.id,
  userId: staff.userId,
  teamId: staff.teamId,
  teamName,
  firstName: staff.firstName,
  lastName: staff.lastName,
  email: userEmail,
  roleInTeam: staff.roleInTeam,
  phoneNumber: staff.phoneNumber,
  fileNumber: staff.fileNumber,
  isActive: staff.isActive,
  deactivatedAt: staff.deactivatedAt ? staff.deactivatedAt.toISOString() : null,
  version: staff.version,
  createdAt: staff.createdAt.toISOString(),
  updatedAt: staff.updatedAt.toISOString(),
})
