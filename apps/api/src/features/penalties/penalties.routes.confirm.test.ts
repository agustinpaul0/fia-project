import { penaltyListSchema } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import type { SessionUser } from '../../core/auth/session'
import { readError } from '../../testing/http'
import { aPenalty, PENALTY_TEAM_ID } from '../../testing/penalty-builders'
import { FIA_ADMIN } from '../../testing/session-users'
import { createTestApp } from '../../testing/test-app'

const OTHER_TEAM = '00000000-0000-4000-8000-000000000099'
const STAFF: SessionUser = { id: 'staff-ferrari', role: 'team_staff', teamId: PENALTY_TEAM_ID }
const OTHER: SessionUser = { id: 'staff-other', role: 'team_staff', teamId: OTHER_TEAM }
const MINE = aPenalty()
const FOREIGN = aPenalty({ id: '00000000-0000-4000-8000-000000000003', teamId: OTHER_TEAM })

const setup = () => {
  const staff = createTestApp({ sessionUser: STAFF, penalties: [MINE, FOREIGN] })
  const { app: _app, ...sharedRepositories } = staff
  const as = (user: SessionUser | null) =>
    createTestApp({ sessionUser: user, sharedRepositories }).app
  return { staff: staff.app, as }
}

const listOf = async (res: Response) => penaltyListSchema.parse(await res.json())

describe('confirmación de notificación de sanciones (US-15)', () => {
  it('la escudería recibe en pendientes sólo las sanciones propias sin confirmar', async () => {
    const { staff } = setup()
    expect((await listOf(await staff.request('/penalties/pending'))).map((p) => p.id)).toEqual([
      MINE.id,
    ])
    await staff.request(`/penalties/${MINE.id}/confirm`, { method: 'POST' })
    expect(await listOf(await staff.request('/penalties/pending'))).toEqual([])
  })

  it('la FIA ve quién confirmó y cuándo; el público no ve el estado', async () => {
    const { staff, as } = setup()
    await staff.request(`/penalties/${MINE.id}/confirm`, { method: 'POST' })
    const forFia = (await listOf(await as(FIA_ADMIN).request('/penalties'))).find(
      (p) => p.id === MINE.id,
    )
    expect(forFia).toMatchObject({ notificationStatus: 'confirmed', confirmedByName: STAFF.id })
    expect(forFia?.confirmedAt).not.toBeNull()
    const forPublic = (await listOf(await as(null).request('/penalties')))[0]
    expect(forPublic).toMatchObject({
      notificationStatus: null,
      confirmedByName: null,
      confirmedAt: null,
    })
  })

  it('no se puede confirmar dos veces ni confirmar sanciones ajenas', async () => {
    const { staff, as } = setup()
    await staff.request(`/penalties/${MINE.id}/confirm`, { method: 'POST' })
    const again = await staff.request(`/penalties/${MINE.id}/confirm`, { method: 'POST' })
    expect((await readError(again)).code).toBe('NOTIFICATION_ALREADY_CONFIRMED')
    const foreign = await as(OTHER).request(`/penalties/${MINE.id}/confirm`, { method: 'POST' })
    expect(foreign.status).toBe(403)
  })

  it('sólo el personal de escudería consulta pendientes', async () => {
    const { as } = setup()
    expect((await as(null).request('/penalties/pending')).status).toBe(401)
    expect((await as(FIA_ADMIN).request('/penalties/pending')).status).toBe(403)
  })
})
