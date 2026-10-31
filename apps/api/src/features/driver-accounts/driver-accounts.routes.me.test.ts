import { driverAccountSchema } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import type { SessionUser } from '../../core/auth/session'
import {
  createDriverAccount,
  DRIVER_USER,
  deleteDriverAccount,
} from '../../testing/driver-account-fixture'
import { readError } from '../../testing/http'
import { TEAM_STAFF } from '../../testing/session-users'
import { createTestApp } from '../../testing/test-app'

const asDriver = async () => {
  const created = await createDriverAccount()
  const { app: _admin, ...sharedRepositories } = created.app
  const driver: SessionUser = { id: created.account.userId, role: 'driver', teamId: null }
  return { ...created, me: createTestApp({ sessionUser: driver, sharedRepositories }).app }
}

describe('GET /driver-accounts/me (área del piloto, US-29)', () => {
  it('el piloto ve su propia cuenta oficial', async () => {
    const { me, account } = await asDriver()
    const res = await me.request('/driver-accounts/me')
    expect(driverAccountSchema.parse(await res.json())).toMatchObject({
      id: account.id,
      driverName: 'Charles Leclerc',
    })
  })

  it('una cuenta dada de baja no accede a su área', async () => {
    const { me, app, account } = await asDriver()
    await deleteDriverAccount(app, account.id, 1)
    const res = await me.request('/driver-accounts/me')
    expect(res.status).toBe(404)
    expect((await readError(res)).code).toBe('DRIVER_ACCOUNT_NOT_FOUND')
  })

  it('un piloto sin cuenta registrada recibe 404 y otros roles 403', async () => {
    const lonely = createTestApp({ sessionUser: DRIVER_USER }).app
    expect((await lonely.request('/driver-accounts/me')).status).toBe(404)
    const staff = createTestApp({ sessionUser: TEAM_STAFF }).app
    expect((await staff.request('/driver-accounts/me')).status).toBe(403)
  })
})
