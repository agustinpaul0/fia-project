import type { SessionResolver, SessionUser } from '../core/auth/session'

export const FIA_ADMIN: SessionUser = { id: 'fia-admin-1', role: 'fia_admin', teamId: null }

export const TEAM_STAFF: SessionUser = { id: 'team-staff-1', role: 'team_staff', teamId: 'team-1' }

export const fixedSessionResolver =
  (user: SessionUser | null): SessionResolver =>
  () =>
    Promise.resolve(user)
