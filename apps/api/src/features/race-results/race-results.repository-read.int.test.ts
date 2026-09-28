import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDatabase, type DatabaseConnection } from '../../core/db/client'
import { seedRacingFixture } from '../../testing/integration/racing-fixture'
import { testDatabaseUrl } from '../../testing/integration/test-database-url'
import { withRollback } from '../../testing/integration/with-rollback'
import { createDrizzleRaceResultsRepository } from './race-results.repository'

describe('DrizzleRaceResultsRepository lecturas (Postgres real)', () => {
  let connection: DatabaseConnection

  beforeAll(() => {
    connection = connectDatabase(testDatabaseUrl())
  })

  afterAll(async () => {
    await connection.close()
  })

  it('lista por temporada y devuelve la categoría de cada piloto', () =>
    withRollback(connection, async (tx) => {
      const f = await seedRacingFixture(tx)
      const repo = createDrizzleRaceResultsRepository(tx)
      expect((await repo.listSeason(2099)).map((r) => r.id)).toEqual([f.raceId])
      expect(await repo.findRace('00000000-0000-4000-8000-0000000000ff')).toBeNull()
      const found = await repo.findDrivers(f.driverIds)
      expect(found.every((d) => d.categoryId === f.categoryId && d.teamId === f.teamId)).toBe(true)
    }))

  it('lista los pilotos de la categoría ordenados por escudería y apellido', () =>
    withRollback(connection, async (tx) => {
      const f = await seedRacingFixture(tx)
      const repo = createDrizzleRaceResultsRepository(tx)
      const list = await repo.listCategoryDrivers(f.categoryId)
      expect(list.map((d) => d.code)).toEqual(['NOR', 'PIA', 'VER'])
      expect(list[0]).toMatchObject({ name: 'Lando Norris', teamName: 'Escudería test' })
      expect(await repo.listCategoryDrivers('00000000-0000-4000-8000-0000000000ff')).toEqual([])
    }))
})
