import type { TeamStaff } from '@fia/shared/contracts'

export type CreateTeamStaffRecord = {
  readonly id?: string
  readonly userId: string
  readonly teamId: string
  readonly firstName: string
  readonly lastName: string
  readonly roleInTeam: string
  readonly phoneNumber: string
  readonly fileNumber: string
}

export type UpdateTeamStaffRecord = {
  readonly teamId: string
  readonly firstName: string
  readonly lastName: string
  readonly roleInTeam: string
  readonly phoneNumber: string
  readonly version: number
}

export type DeactivateTeamStaffRecord = {
  readonly version: number
  readonly deactivatedBy: string
  readonly deactivatedAt: Date
}

export type TeamStaffRepository = {
  readonly findAll: () => Promise<readonly TeamStaff[]>
  readonly findById: (id: string) => Promise<TeamStaff | null>
  readonly findByFileNumber: (fileNumber: string) => Promise<TeamStaff | null>
  readonly findByUserId: (userId: string) => Promise<TeamStaff | null>
  readonly create: (input: CreateTeamStaffRecord) => Promise<TeamStaff>
  readonly update: (id: string, input: UpdateTeamStaffRecord) => Promise<TeamStaff | null>
  readonly deactivate: (id: string, input: DeactivateTeamStaffRecord) => Promise<TeamStaff | null>
}
