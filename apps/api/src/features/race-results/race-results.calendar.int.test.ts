import { circuits, races, user } from '@fia/shared/db'
import { eq } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import {
  connectDatabase,
  type DatabaseConnection,
  type DatabaseTransaction,
} from '../../core/db/client'
import { seedRacingFixture } from '../../testing/integration/racing-fixture'
import { testDatabaseUrl } from '../../testing/integration/test-database-url'
import { withRollback } from '../../testing/integration/with-rollback'
import { createDrizzleRaceResultsRepository } from './race-results.repository'

const setup = async (tx: DatabaseTransaction) => {
  const fixture = await seedRacingFixture(tx)
  const now = new Date()
  await tx.insert(user).values({
    id: 'fia-qa',
    name: 'FIA QA',
    email: 'qa@fia.com',
    role: 'fia_admin',
    createdAt: now,
    updatedAt: now,
  })
  const [other] = await tx
    .insert(circuits)
    .values({ name: 'Circuito alternativo', country: 'Argentina', city: 'Termas', lengthKm: '4.8' })
    .returning({ id: circuits.id })
  return {
    ...fixture,
    otherCircuitId: other?.id ?? '',
    repo: createDrizzleRaceResultsRepository(tx),
  }
}

describe('Modificación y baja de eventos (US-19, Postgres real)', () => {
  let connection: DatabaseConnection

  beforeAll(() => {
    connection = connectDatabase(testDatabaseUrl())
  })

  afterAll(async () => {
    await connection.close()
  })

  it('modifica fecha, circuito y tipo, registra quién y lo expone en el calendario', () =>
    withRollback(connection, async (tx) => {
      const { raceId, otherCircuitId, repo } = await setup(tx)
      const body = {
        name: 'GP reprogramado',
        date: '2099-04-01T15:00:00.000Z',
        type: 'sprint',
        circuitId: otherCircuitId,
        version: 1,
      } as const
      expect(await repo.updateRace(raceId, body, 'fia-qa')).toBe(true)
      expect(await repo.updateRace(raceId, body, 'fia-qa')).toBe(false)
      const race = await repo.findRace(raceId)
      expect(race).toMatchObject({
        status: 'modified',
        type: 'sprint',
        circuitName: 'Circuito alternativo',
        version: 2,
      })
      const [row] = await tx.select().from(races).where(eq(races.id, raceId))
      expect(row?.updatedByUserId).toBe('fia-qa')
      expect((await repo.listCircuits()).map((c) => c.id)).toContain(otherCircuitId)
    }))

  it('la baja es lógica y queda como cancelada en el listado de la temporada', () =>
    withRollback(connection, async (tx) => {
      const { raceId, repo } = await setup(tx)
      expect(await repo.cancelRace(raceId, 1, 'fia-qa')).toBe(true)
      const season = await repo.listSeason({ season: 2099 })
      expect(season.find((r) => r.id === raceId)).toMatchObject({ status: 'cancelled', version: 2 })
    }))
})
