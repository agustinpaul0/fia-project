import { teamStaffListSchema } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import { FIA_ADMIN, TEAM_STAFF } from '../../testing/session-users'
import { buildTeamStaffDto } from '../../testing/team-staff-builders'
import { createTestApp } from '../../testing/test-app'

describe('GET /team-staff (lectura)', () => {
  const staffMembers = [
    buildTeamStaffDto({ id: '00000000-0000-4000-8000-000000000001', lastName: 'Alonso' }),
    buildTeamStaffDto({
      id: '00000000-0000-4000-8000-000000000002',
      lastName: 'Bottas',
      isActive: false,
      deactivatedAt: '2026-02-01T00:00:00.000Z',
    }),
  ]

  it('responde 401 si no hay sesión', async () => {
    const { app } = createTestApp({ staff: staffMembers })
    const res = await app.request('/team-staff')
    expect(res.status).toBe(401)
  })

  it('responde 403 si el rol no es fia_admin', async () => {
    const { app } = createTestApp({ staff: staffMembers, sessionUser: TEAM_STAFF })
    const res = await app.request('/team-staff')
    expect(res.status).toBe(403)
  })

  it('responde 200 con la lista completa y cumple el contrato sin secretos', async () => {
    const { app } = createTestApp({ staff: staffMembers, sessionUser: FIA_ADMIN })
    const res = await app.request('/team-staff')
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(teamStaffListSchema.safeParse(data).success).toBe(true)
    expect(data).toHaveLength(2)

    for (const item of data as Record<string, unknown>[]) {
      expect(item).not.toHaveProperty('password')
      expect(item).not.toHaveProperty('passwordHash')
      expect(item).not.toHaveProperty('banReason')
    }
  })
})
