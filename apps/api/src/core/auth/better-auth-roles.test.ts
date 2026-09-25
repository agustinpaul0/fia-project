import { describe, expect, it } from 'vitest'
import { ADMIN_ROLES, authRoles } from './better-auth-roles'

describe('Access Control de Better Auth', () => {
  it('define fia_admin como rol administrativo exclusivo', () => {
    expect(ADMIN_ROLES).toEqual(['fia_admin'])
  })

  it('fia_admin tiene permisos de creación, actualización, rol y ban', () => {
    expect(authRoles.fia_admin.authorize({ user: ['create'] })).toEqual({ success: true })
    expect(authRoles.fia_admin.authorize({ user: ['update'] })).toEqual({ success: true })
    expect(authRoles.fia_admin.authorize({ user: ['set-role'] })).toEqual({ success: true })
    expect(authRoles.fia_admin.authorize({ user: ['ban'] })).toEqual({ success: true })
  })

  it('fia_admin no puede borrar usuarios ni impersonar', () => {
    expect(authRoles.fia_admin.authorize({ user: ['delete'] }).success).toBe(false)
    expect(authRoles.fia_admin.authorize({ user: ['impersonate'] }).success).toBe(false)
  })

  it('team_staff y public no tienen permisos administrativos', () => {
    expect(authRoles.team_staff.authorize({ user: ['create'] }).success).toBe(false)
    expect(authRoles.team_staff.authorize({ user: ['ban'] }).success).toBe(false)
    expect(authRoles.public.authorize({ user: ['create'] }).success).toBe(false)
    expect(authRoles.public.authorize({ user: ['ban'] }).success).toBe(false)
  })
})
