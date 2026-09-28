import { scoreNotifications, user } from '@fia/shared/db'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import {
  connectDatabase,
  type DatabaseConnection,
  type DatabaseTransaction,
} from '../../core/db/client'
import { type RacingFixture, seedRacingFixture } from '../../testing/integration/racing-fixture'
import { testDatabaseUrl } from '../../testing/integration/test-database-url'
import { withRollback } from '../../testing/integration/with-rollback'
import { createDrizzleRaceResultsRepository } from '../race-results/race-results.repository'
import { createDrizzleNotificationsRepository } from './notifications.repository'

const publish = async (tx: DatabaseTransaction, f: RacingFixture, revision: number) => {
  const entries = f.driverIds.map((driverId, i) => ({
    driverId,
    teamId: f.teamId,
    position: i + 1,
    points: [25, 18, 15][i] ?? 0,
  }))
  await createDrizzleRaceResultsRepository(tx).replaceClassification({
    raceId: f.raceId,
    expectedVersion: revision,
    nextRevision: revision,
    entries,
  })
}

const addUser = async (tx: DatabaseTransaction) => {
  const now = new Date()
  await tx.insert(user).values({
    id: 'staff-1',
    name: 'Ana Pérez',
    email: 'ana@test.com',
    createdAt: now,
    updatedAt: now,
  })
}

describe('Confirmación de notificaciones (Postgres real)', () => {
  let connection: DatabaseConnection

  beforeAll(() => {
    connection = connectDatabase(testDatabaseUrl())
  })

  afterAll(async () => {
    await connection.close()
  })

  it('confirma una sola vez guardando quién y cuándo', () =>
    withRollback(connection, async (tx) => {
      const f = await seedRacingFixture(tx)
      const repo = createDrizzleNotificationsRepository(tx)
      await addUser(tx)
      await publish(tx, f, 1)
      await repo.syncPending(f.teamId)
      const [notification] = await repo.listPendingForTeam(f.teamId)
      const id = notification?.id ?? ''
      const at = new Date('2099-03-02T10:00:00.000Z')
      expect(await repo.confirm({ id, userId: 'staff-1', at })).toBe(true)
      expect(await repo.confirm({ id, userId: 'staff-1', at })).toBe(false)
      expect(await repo.findById(id)).toMatchObject({
        confirmedAt: at,
        confirmedByName: 'Ana Pérez',
      })
      expect(await repo.listPendingForTeam(f.teamId)).toEqual([])
      expect(
        await repo.confirm({ id: '00000000-0000-4000-8000-00000000beef', userId: 'staff-1', at }),
      ).toBe(false)
    }))
  it('la base rechaza una confirmación sin usuario', () =>
    withRollback(connection, async (tx) => {
      const f = await seedRacingFixture(tx)
      const insert = tx.insert(scoreNotifications).values({
        raceId: f.raceId,
        teamId: f.teamId,
        resultsRevision: 1,
        confirmedAt: new Date(),
      })
      await expect(insert).rejects.toThrow()
    }))
})
