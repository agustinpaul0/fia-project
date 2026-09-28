import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDatabase, type DatabaseConnection } from '../../core/db/client'
import { type RacingFixture, seedRacingFixture } from '../../testing/integration/racing-fixture'
import { testDatabaseUrl } from '../../testing/integration/test-database-url'
import { withRollback } from '../../testing/integration/with-rollback'
import { createDrizzleRaceResultsRepository } from './race-results.repository'

const entriesFor = (f: RacingFixture, points: readonly number[]) =>
  f.driverIds.map((driverId, i) => ({
    driverId,
    teamId: f.teamId,
    position: i + 1,
    points: points[i] ?? 0,
  }))

describe('DrizzleRaceResultsRepository escrituras (Postgres real)', () => {
  let connection: DatabaseConnection

  beforeAll(() => {
    connection = connectDatabase(testDatabaseUrl())
  })

  afterAll(async () => {
    await connection.close()
  })

  it('reemplaza la clasificación, sube versión y revisión y expone al ganador', () =>
    withRollback(connection, async (tx) => {
      const f = await seedRacingFixture(tx)
      const repo = createDrizzleRaceResultsRepository(tx)
      const first = { raceId: f.raceId, expectedVersion: 1, nextRevision: 1 }
      expect(
        await repo.replaceClassification({ ...first, entries: entriesFor(f, [25, 18, 15]) }),
      ).toBe(true)
      const second = { raceId: f.raceId, expectedVersion: 2, nextRevision: 2 }
      const reversed = entriesFor(f, [25, 18, 15]).map((e, i, all) => ({
        ...e,
        driverId: all[all.length - 1 - i]?.driverId ?? '',
      }))
      expect(await repo.replaceClassification({ ...second, entries: reversed })).toBe(true)
      expect(await repo.findRace(f.raceId)).toMatchObject({
        version: 3,
        resultsRevision: 2,
        winnerName: 'Max Verstappen',
      })
      expect((await repo.findClassification(f.raceId)).map((r) => r.driverCode)).toEqual([
        'VER',
        'PIA',
        'NOR',
      ])
    }))
  it('no toca nada si la versión no coincide', () =>
    withRollback(connection, async (tx) => {
      const f = await seedRacingFixture(tx)
      const repo = createDrizzleRaceResultsRepository(tx)
      const stale = {
        raceId: f.raceId,
        expectedVersion: 7,
        nextRevision: 1,
        entries: entriesFor(f, [1]),
      }
      expect(await repo.replaceClassification(stale)).toBe(false)
      expect(await repo.findClassification(f.raceId)).toEqual([])
    }))
  it('la base rechaza puntos por encima del máximo aunque no pasen por el servicio', () =>
    withRollback(connection, async (tx) => {
      const f = await seedRacingFixture(tx)
      const repo = createDrizzleRaceResultsRepository(tx)
      const input = {
        raceId: f.raceId,
        expectedVersion: 1,
        nextRevision: 1,
        entries: entriesFor(f, [26]),
      }
      await expect(repo.replaceClassification(input)).rejects.toMatchObject({
        code: 'VALIDATION_FAILED',
      })
    }))
  it('traduce un piloto inexistente a DRIVER_NOT_FOUND', () =>
    withRollback(connection, async (tx) => {
      const f = await seedRacingFixture(tx)
      const repo = createDrizzleRaceResultsRepository(tx)
      const ghost = [
        {
          driverId: '00000000-0000-4000-8000-00000000dead',
          teamId: f.teamId,
          position: 1,
          points: 25,
        },
      ]
      const input = { raceId: f.raceId, expectedVersion: 1, nextRevision: 1, entries: ghost }
      await expect(repo.replaceClassification(input)).rejects.toMatchObject({
        code: 'DRIVER_NOT_FOUND',
      })
    }))
})
