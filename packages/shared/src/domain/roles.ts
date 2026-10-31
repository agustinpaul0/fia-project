export const ROLES = ['fia_admin', 'team_staff', 'driver', 'public'] as const

export type Role = (typeof ROLES)[number]

export const CHAT_ROLES = ['fia_admin', 'team_staff', 'driver'] as const

export type ChatRole = (typeof CHAT_ROLES)[number]

export const ROLE_LABELS: Readonly<Record<Role, string>> = {
  fia_admin: 'Admin FIA',
  team_staff: 'Admin escudería',
  driver: 'Piloto',
  public: 'Usuario común',
}
