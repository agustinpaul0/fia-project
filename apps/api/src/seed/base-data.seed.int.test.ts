import { raceResults, races, seasons } from '@fia/shared/db'
import { and, eq } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDatabase, type DatabaseConnection } from '../core/db/client'
import { testDatabaseUrl } from '../testing/integration/test-database-url'
import { withRollback } from '../testing/integration/with-rollback'
import { seedBaseData } from './base-data.seed'
import { seedCategories } from './categories.seed'

describe('Seed de datos base (Postgres real)', () => {
  let connection: DatabaseConnection

  beforeAll(() => {
    connection = connectDatabase(testDatabaseUrl())
  })

  afterAll(async () => {
    await connection.close()
  })

  it('carga resultados de las últimas 5 temporadas con Grandes Premios y sprints', () =>
    withRollback(connection, async (tx) => {
      await seedCategories(tx)
      await seedBaseData(tx)
      const rows = await tx
        .select({ year: seasons.year, type: races.type, points: raceResults.points })
        .from(raceResults)
        .innerJoin(races, eq(races.id, raceResults.raceId))
        .innerJoin(seasons, eq(seasons.id, races.seasonId))
        .where(eq(raceResults.position, 1))
      const years = [...new Set(rows.map((row) => row.year))].sort()
      expect(years).toEqual([2021, 2022, 2023, 2024, 2025])
      expect(new Set(rows.map((row) => `${row.type}:${row.points}`))).toEqual(
        new Set(['grand_prix:25', 'sprint:8']),
      )
    }))

  it('es idempotente y deja la carrera de 2026 sin resultados', () =>
    withRollback(connection, async (tx) => {
      await seedCategories(tx)
      await seedBaseData(tx)
      await seedBaseData(tx)
      const planned = await tx
        .select({ id: races.id })
        .from(races)
        .innerJoin(seasons, eq(seasons.id, races.seasonId))
        .where(and(eq(seasons.year, 2026), eq(races.round, 1)))
      expect(planned).toHaveLength(1)
      const [race] = planned
      const results = await tx
        .select()
        .from(raceResults)
        .where(eq(raceResults.raceId, race?.id ?? ''))
      expect(results).toEqual([])
    }))
})
