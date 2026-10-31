import { driverAccountSchema } from '@fia/shared/contracts'
import type { SessionUser } from '../core/auth/session'
import { aDriverRow } from './driver-row-builders'
import { sendJson } from './http'
import { FIA_ADMIN } from './session-users'
import { createTestApp, type TestApp } from './test-app'

export const ACCOUNT_DRIVER = aDriverRow()

export const ACCOUNT_BODY = {
  driverId: ACCOUNT_DRIVER.id,
  email: 'leclerc@ferrari.com',
  password: 'Password123!',
  name: 'Charles Leclerc',
}

export const DRIVER_USER: SessionUser = { id: 'drv-1', role: 'driver', teamId: null }

export const driverAccountsAppAs = (user: SessionUser | null): TestApp =>
  createTestApp({ sessionUser: user, teamDrivers: [ACCOUNT_DRIVER] })

export const postDriverAccount = (app: TestApp, body: unknown = ACCOUNT_BODY) =>
  sendJson(app.app, { method: 'POST', path: '/driver-accounts', body })

export const createDriverAccount = async (app = driverAccountsAppAs(FIA_ADMIN)) => {
  const res = await postDriverAccount(app)
  return { app, res, account: driverAccountSchema.parse(await res.json()) }
}

export const deleteDriverAccount = (app: TestApp, id: string, version: number) =>
  app.app.request(`/driver-accounts/${id}?version=${version}`, { method: 'DELETE' })
