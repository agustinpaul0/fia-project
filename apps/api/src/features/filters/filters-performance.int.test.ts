import { penalties, technicalControls } from '@fia/shared/db'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDatabase, type DatabaseConnection } from '../../core/db/client'
import { seedRacingFixture } from '../../testing/integration/racing-fixture'
import { testDatabaseUrl } from '../../testing/integration/test-database-url'
import { withRollback } from '../../testing/integration/with-rollback'
import { createDrizzlePenaltiesRepository } from '../penalties/penalties.repository'
import { createDrizzleTechnicalControlsRepository } from '../technical-controls/technical-controls.repository'

const DAYS = 5 * 365
const START = Date.UTC(2094, 0, 1)
const dayAt = (i: number): Date => new Date(START + i * 86_400_000)
const LIMIT_MS = 2000

const elapsed = async (run: () => Promise<unknown>): Promise<number> => {
  const started = performance.now()
  await run()
  return performance.now() - started
}

describe('Filtros con 5 años de datos (US-3, Postgres real)', () => {
  let connection: DatabaseConnection

  beforeAll(() => {
    connection = connectDatabase(testDatabaseUrl())
  })

  afterAll(async () => {
    await connection.close()
  })

  it('sanciones y controles responden en menos de 2 s con filtros solos y combinados', () =>
    withRollback(connection, async (tx) => {
      const { teamId, driverIds } = await seedRacingFixture(tx)
      const driverId = driverIds[0] ?? null
      const days = Array.from({ length: DAYS }, (_, i) => i)
      await tx.insert(penalties).values(
        days.map((i) => ({
          teamId,
          driverId,
          type: 'fine',
          penalty: 'Multa',
          reason: 'Motivo test.',
          issuedAt: dayAt(i),
        })),
      )
      await tx.insert(technicalControls).values(
        days.map((i) => ({
          teamId,
          driverId,
          carNumber: 4,
          controlType: 'fuel',
          status: 'passed',
          inspectedAt: dayAt(i),
          expiresAt: new Date(Date.UTC(2200, 0, 1)),
        })),
      )
      const penaltyRepo = createDrizzlePenaltiesRepository(tx)
      const controlsRepo = createDrizzleTechnicalControlsRepository(tx)
      const since = new Date(START)
      const activeAt = new Date(START)
      const range = { from: '2096-01-01T00:00:00.000Z', to: '2096-12-31T23:59:59.000Z' }
      const runs = [
        () => penaltyRepo.list({ issuedSince: since }),
        () => penaltyRepo.list({ issuedSince: since, season: 2097, type: 'fine', teamId }),
        () =>
          penaltyRepo.list({
            issuedSince: since,
            ...range,
            driverId: driverId ?? '',
            sort: 'date_asc',
          }),
        () => controlsRepo.list({ activeAt }),
        () =>
          controlsRepo.list({ activeAt, ...range, controlType: 'fuel', teamId, sort: 'relevance' }),
      ]
      for (const run of runs) {
        expect(await elapsed(run)).toBeLessThan(LIMIT_MS)
      }
      expect(await penaltyRepo.list({ issuedSince: since, ...range })).toHaveLength(366)
    }))
})
