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

describe('Sincronización de notificaciones (Postgres real)', () => {
  let connection: DatabaseConnection

  beforeAll(() => {
    connection = connectDatabase(testDatabaseUrl())
  })

  afterAll(async () => {
    await connection.close()
  })

  it('crea una notificación por escudería y revisión, sin duplicar, con los puntos sumados', () =>
    withRollback(connection, async (tx) => {
      const f = await seedRacingFixture(tx)
      const repo = createDrizzleNotificationsRepository(tx)
      await publish(tx, f, 1)
      await repo.syncPending(f.teamId)
      await repo.syncPending(null)
      const pending = await repo.listPendingForTeam(f.teamId)
      expect(pending).toHaveLength(1)
      expect(pending[0]).toMatchObject({ resultsRevision: 1, latestRevision: 1, teamPoints: 58 })
    }))
  it('una corrección deja vigente sólo la notificación de la última revisión', () =>
    withRollback(connection, async (tx) => {
      const f = await seedRacingFixture(tx)
      const repo = createDrizzleNotificationsRepository(tx)
      await publish(tx, f, 1)
      await repo.syncPending(null)
      await publish(tx, f, 2)
      await repo.syncPending(null)
      expect((await repo.listPendingForTeam(f.teamId)).map((n) => n.resultsRevision)).toEqual([2])
      expect((await repo.listLatest()).map((n) => n.resultsRevision)).toEqual([2])
    }))
})
