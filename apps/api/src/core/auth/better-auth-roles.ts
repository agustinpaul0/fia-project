import { defaultAc } from 'better-auth/plugins/admin/access'

export const ADMIN_ROLES = ['fia_admin'] as const

export const authRoles = {
  fia_admin: defaultAc.newRole({
    user: ['create', 'update', 'set-role', 'ban'],
  }),
  team_staff: defaultAc.newRole({
    user: [],
  }),
  public: defaultAc.newRole({
    user: [],
  }),
}
