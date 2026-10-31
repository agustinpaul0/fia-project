import { driverAccountListSchema, driverAccountSchema } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import { createDriverAccount, deleteDriverAccount } from '../../testing/driver-account-fixture'
import { readError, sendJson } from '../../testing/http'

const putAccount = (
  app: Awaited<ReturnType<typeof createDriverAccount>>['app'],
  id: string,
  body: unknown,
) => sendJson(app.app, { method: 'PUT', path: `/driver-accounts/${id}`, body })

describe('modificación y baja de cuentas de pilotos (US-27)', () => {
  it('modifica el nombre con concurrencia optimista', async () => {
    const { app, account } = await createDriverAccount()
    const ok = await putAccount(app, account.id, { name: 'C. Leclerc', version: 1 })
    expect(driverAccountSchema.parse(await ok.json())).toMatchObject({
      name: 'C. Leclerc',
      version: 2,
    })
    const stale = await putAccount(app, account.id, { name: 'X Y', version: 1 })
    expect(stale.status).toBe(409)
    expect((await readError(stale)).code).toBe('STALE_VERSION')
  })

  it('una cuenta inexistente responde DRIVER_ACCOUNT_NOT_FOUND', async () => {
    const { app } = await createDriverAccount()
    const res = await putAccount(app, '00000000-0000-4000-9000-000000000099', {
      name: 'Nadie',
      version: 1,
    })
    expect(res.status).toBe(404)
    expect((await readError(res)).code).toBe('DRIVER_ACCOUNT_NOT_FOUND')
  })

  it('la baja es lógica: bloquea el acceso y sigue listada como inactiva', async () => {
    const { app, account } = await createDriverAccount()
    const res = await deleteDriverAccount(app, account.id, 1)
    expect(driverAccountSchema.parse(await res.json()).isActive).toBe(false)
    expect(app.driverAccountsUow.users.get(account.userId)?.banned).toBe(true)
    const list = await (await app.app.request('/driver-accounts')).json()
    expect(driverAccountListSchema.parse(list).map((a) => a.isActive)).toEqual([false])
  })

  it('repetir la baja con la misma versión es idempotente y con otra es conflicto', async () => {
    const { app, account } = await createDriverAccount()
    await deleteDriverAccount(app, account.id, 1)
    expect((await deleteDriverAccount(app, account.id, 2)).status).toBe(200)
    expect((await deleteDriverAccount(app, account.id, 1)).status).toBe(409)
  })

  it('una cuenta dada de baja no se puede modificar', async () => {
    const { app, account } = await createDriverAccount()
    await deleteDriverAccount(app, account.id, 1)
    const res = await putAccount(app, account.id, { name: 'Nuevo nombre', version: 2 })
    expect(res.status).toBe(409)
    expect((await readError(res)).code).toBe('DRIVER_ACCOUNT_INACTIVE')
  })
})
