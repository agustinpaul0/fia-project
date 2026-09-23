export const ROLES = ['fia_admin', 'team_staff', 'public'] as const

export type Role = (typeof ROLES)[number]
