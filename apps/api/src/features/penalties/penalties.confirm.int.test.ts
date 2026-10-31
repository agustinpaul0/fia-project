import { user } from '@fia/shared/db'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDatabase, type DatabaseConnection } from '../../core/db/client'
import { seedRacingFixture } from '../../testing/integration/racing-fixture'
import { testDatabaseUrl } from '../../testing/integration/test-database-url'
import { withRollback } from '../../testing/integration/with-rollback'
import { createDrizzlePenaltiesRepository } from './penalties.repository'

describe('Confirmación de sanciones (US-15, Postgres real)', () => {
  let connection: DatabaseConnection

  beforeAll(() => {
    connection = connectDatabase(testDatabaseUrl())
  })

  afterAll(async () => {
    await connection.close()
  })

  it('guarda usuario y fecha, versiona y no permite confirmar dos veces', () =>
    withRollback(connection, async (tx) => {
      const { teamId } = await seedRacingFixture(tx)
      const now = new Date()
      await tx.insert(user).values({
        id: 'staff-qa',
        name: 'Fred Vasseur',
        email: 'fred@escuderia.com',
        role: 'team_staff',
        createdAt: now,
        updatedAt: now,
      })
      const repo = createDrizzlePenaltiesRepository(tx)
      const created = await repo.create({
        teamId,
        type: 'fine',
        penalty: 'Multa',
        reason: 'Motivo de prueba.',
        issuedAt: '2099-05-01T00:00:00.000Z',
      })
      expect(created).toMatchObject({ confirmedAt: null, confirmedByName: null })
      const confirmedAt = new Date(Date.now() + 1000)
      const input = { id: created.id, userId: 'staff-qa', confirmedAt, version: 1 }
      const confirmed = await repo.confirm(input)
      expect(confirmed).toMatchObject({
        confirmedByName: 'Fred Vasseur',
        confirmedAt: confirmedAt.toISOString(),
        notificationStatus: 'confirmed',
        version: 2,
      })
      expect(await repo.confirm({ ...input, version: 2 })).toBeNull()
    }))
})
