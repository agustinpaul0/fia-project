import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDatabase, type DatabaseConnection } from '../../core/db/client'
import { seedRacingFixture } from '../../testing/integration/racing-fixture'
import { testDatabaseUrl } from '../../testing/integration/test-database-url'
import { withRollback } from '../../testing/integration/with-rollback'
import { createDrizzleTeamsRepository } from './teams.repository'

describe('DrizzleTeamsRepository (Postgres real)', () => {
  let connection: DatabaseConnection

  beforeAll(() => {
    connection = connectDatabase(testDatabaseUrl())
  })

  afterAll(async () => {
    await connection.close()
  })

  it('lista los pilotos de una escudería ordenados por apellido', () =>
    withRollback(connection, async (tx) => {
      const { teamId } = await seedRacingFixture(tx)
      const options = await createDrizzleTeamsRepository(tx).findDriverOptions(teamId)
      expect(options.map((o) => o.name)).toEqual([
        'Lando Norris',
        'Oscar Piastri',
        'Max Verstappen',
      ])
    }))

  it('lista las carreras de la categoría de la escudería en esa temporada', () =>
    withRollback(connection, async (tx) => {
      const { teamId, raceId } = await seedRacingFixture(tx)
      const repo = createDrizzleTeamsRepository(tx)
      expect(await repo.findRaceOptions(teamId, 2099)).toEqual([
        { id: raceId, name: 'Gran Premio test', date: '2099-03-01T15:00:00.000Z' },
      ])
      expect(await repo.findRaceOptions(teamId, 2098)).toEqual([])
    }))
})
