import type { Role } from '@fia/shared/domain'

export const ROLE_HOME = {
  fia_admin: '/admin/team-staff',
  team_staff: '/team/drivers',
  driver: '/driver',
  public: '/',
} as const satisfies Readonly<Record<Role, string>>

export const homeFor = (role: string | null | undefined): (typeof ROLE_HOME)[Role] =>
  role !== null && role !== undefined && role in ROLE_HOME
    ? ROLE_HOME[role as Role]
    : ROLE_HOME.public
