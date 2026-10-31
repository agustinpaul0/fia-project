import { describe, expect, it } from 'vitest'
import {
  ACCOUNT_BODY,
  ACCOUNT_DRIVER,
  createDriverAccount,
  DRIVER_USER,
  deleteDriverAccount,
  driverAccountsAppAs,
  postDriverAccount,
} from '../../testing/driver-account-fixture'
import { aDriverRow } from '../../testing/driver-row-builders'
import { readError } from '../../testing/http'
import { FIA_ADMIN, TEAM_STAFF } from '../../testing/session-users'
import { createTestApp } from '../../testing/test-app'

describe('alta de cuentas oficiales de pilotos (US-27)', () => {
  it('la FIA crea la cuenta oficial con rol Piloto asociada a un piloto existente', async () => {
    const { res, account, app } = await createDriverAccount()
    expect(res.status).toBe(201)
    expect(account).toMatchObject({ role: 'driver', isOfficial: true, isActive: true })
    expect(account).toMatchObject({ driverName: 'Charles Leclerc', email: ACCOUNT_BODY.email })
    expect(app.driverAccountsUow.users.get(account.userId)?.role).toBe('driver')
  })

  it('un piloto inexistente se rechaza con DRIVER_NOT_FOUND', async () => {
    const body = { ...ACCOUNT_BODY, driverId: '00000000-0000-4000-8000-000000000099' }
    const res = await postDriverAccount(driverAccountsAppAs(FIA_ADMIN), body)
    expect(res.status).toBe(404)
    expect((await readError(res)).code).toBe('DRIVER_NOT_FOUND')
  })

  it('cada piloto tiene una sola cuenta', async () => {
    const { app } = await createDriverAccount()
    const res = await postDriverAccount(app, { ...ACCOUNT_BODY, email: 'otro@ferrari.com' })
    expect(res.status).toBe(409)
    expect((await readError(res)).code).toBe('DRIVER_ACCOUNT_ALREADY_EXISTS')
  })

  it('el mail no se repite ni se reutiliza aunque la cuenta esté dada de baja', async () => {
    const other = aDriverRow({ id: '00000000-0000-4000-8000-000000000021', code: 'SAI' })
    const app = createTestApp({ sessionUser: FIA_ADMIN, teamDrivers: [ACCOUNT_DRIVER, other] })
    const { account } = await createDriverAccount(app)
    await deleteDriverAccount(app, account.id, 1)
    const res = await postDriverAccount(app, { ...ACCOUNT_BODY, driverId: other.id })
    expect(res.status).toBe(409)
    expect((await readError(res)).code).toBe('USER_ALREADY_EXISTS')
  })

  it.each([
    [null, 401],
    [TEAM_STAFF, 403],
    [DRIVER_USER, 403],
  ])('sólo la FIA gestiona cuentas (%o ⇒ %i)', async (user, status) => {
    const app = driverAccountsAppAs(user)
    expect((await app.app.request('/driver-accounts')).status).toBe(status)
    expect((await postDriverAccount(app)).status).toBe(status)
    expect((await deleteDriverAccount(app, ACCOUNT_DRIVER.id, 1)).status).toBe(status)
  })
})
