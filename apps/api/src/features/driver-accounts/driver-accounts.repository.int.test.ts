import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createBetterAuth } from '../../core/auth/better-auth'
import {
  connectDatabase,
  type DatabaseConnection,
  type DatabaseTransaction,
} from '../../core/db/client'
import { seedRacingFixture } from '../../testing/integration/racing-fixture'
import { testDatabaseUrl } from '../../testing/integration/test-database-url'
import { withRollback } from '../../testing/integration/with-rollback'
import { createDrizzleStaffAccountsAdapter } from '../team-staff/team-staff-accounts.adapter'
import { createDrizzleDriverAccountsRepository } from './driver-accounts.repository'

const setup = async (tx: DatabaseTransaction) => {
  const fixture = await seedRacingFixture(tx)
  const users = createDrizzleStaffAccountsAdapter(
    createBetterAuth({
      db: tx,
      secret: 'secreto-de-prueba-con-mas-de-32-caracteres',
      baseURL: 'http://localhost:3000',
      trustedOrigins: ['http://localhost:5173'],
    }),
  )
  const newUser = (email: string) =>
    users.createAccount({
      email,
      password: 'Password123!',
      name: 'Lando',
      role: 'driver',
      teamId: null,
    })
  return { fixture, newUser, repo: createDrizzleDriverAccountsRepository(tx) }
}

describe('DrizzleDriverAccountsRepository (Postgres real)', () => {
  let connection: DatabaseConnection

  beforeAll(() => {
    connection = connectDatabase(testDatabaseUrl())
  })

  afterAll(async () => {
    await connection.close()
  })

  it('crea y lista la cuenta con los datos del piloto y del usuario', () =>
    withRollback(connection, async (tx) => {
      const { fixture, newUser, repo } = await setup(tx)
      const driverId = fixture.driverIds[0] ?? ''
      const { userId } = await newUser('lando@mclaren.com')
      const created = await repo.create({ userId, driverId })
      expect(created).toMatchObject({
        driverName: 'Lando Norris',
        driverCode: 'NOR',
        isActive: true,
      })
      expect(created).toMatchObject({ email: 'lando@mclaren.com', teamName: expect.any(String) })
      expect(await repo.findByDriverId(driverId)).toEqual(created)
      expect((await repo.list()).map((a) => a.id)).toContain(created.id)
    }))

  it('la base impide una segunda cuenta para el mismo piloto', () =>
    withRollback(connection, async (tx) => {
      const { fixture, newUser, repo } = await setup(tx)
      const driverId = fixture.driverIds[0] ?? ''
      await repo.create({ userId: (await newUser('a@mclaren.com')).userId, driverId })
      const second = (await newUser('b@mclaren.com')).userId
      await expect(repo.create({ userId: second, driverId })).rejects.toMatchObject({
        code: 'DRIVER_ACCOUNT_ALREADY_EXISTS',
      })
    }))

  it('versiona las modificaciones y la baja, y rechaza versiones viejas', () =>
    withRollback(connection, async (tx) => {
      const { fixture, newUser, repo } = await setup(tx)
      const { userId } = await newUser('lando@mclaren.com')
      const created = await repo.create({ userId, driverId: fixture.driverIds[0] ?? '' })
      expect((await repo.bumpVersion(created.id, 1))?.version).toBe(2)
      expect(await repo.bumpVersion(created.id, 1)).toBeNull()
      const input = { version: 2, deactivatedBy: userId, deactivatedAt: new Date() }
      const deactivated = await repo.deactivate(created.id, input)
      expect(deactivated).toMatchObject({ isActive: false, version: 3 })
      expect(deactivated?.deactivatedAt).not.toBeNull()
    }))

  it('devuelve el piloto destino o null si no existe', () =>
    withRollback(connection, async (tx) => {
      const { fixture, repo } = await setup(tx)
      const driverId = fixture.driverIds[0] ?? ''
      expect(await repo.findDriver(driverId)).toEqual({ id: driverId, teamId: fixture.teamId })
      expect(await repo.findDriver('00000000-0000-4000-8000-000000000999')).toBeNull()
    }))
})
